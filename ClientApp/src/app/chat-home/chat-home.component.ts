import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { RoomService } from '../services/room.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map, share } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { UserRoom } from '../models/user.room';
import { MessageService } from '../services/message.service';
import { SignalRService } from '../services/signal-r.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Message } from '../models/message';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class ChatHomeComponent implements OnInit, OnDestroy {
  user: User;
  searchTerm = '';
  selectedRoom: UserRoom = null;
  messageText;
  isLoading = false;

  members: User[] = [];
  groupName;

  private typingUsernames: string[] = [];
  private typingSubject: BehaviorSubject<string[]>;
  public typing: Observable<string[]>;
  
  constructor(
    public roomService: RoomService,
    public userService: UserService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    public searchService: SearchService,
    public signalRService: SignalRService,
    private modalService: NgbModal) { }

  ngOnDestroy(): void {
    this.selectedRoom = null;
  }

  ngOnInit(): void {
    this.typingSubject = new BehaviorSubject<string[]>(this.typingUsernames);
    this.typing = this.typingSubject.asObservable();

    if (!this.signalRService.onGoOnlineListener)
      this.signalRService.addOnGoOnlineListener((userId) => {
        this.roomService.rooms.forEach(r => {
          r.members.forEach(m => {
            if (m.id === userId)
              m.isConnected = true;
          })
        })
      });

    if (!this.signalRService.onGoOfflineListener)
      this.signalRService.addOnGoOfflineListener((userId) => {
        this.roomService.rooms.forEach(r => {
          r.members.forEach(m => {
            if (m.id === userId) {
              m.isConnected = false;
              m.lastSeen = new Date(new Date().getTime() + (new Date()).getTimezoneOffset()*60*1000);
            }
          })
        })
      });
  
    if (!this.signalRService.onSendMessageListener)
      this.signalRService.addOnSendMessageListener((message: Message) => {
        const idx = this.roomService.rooms.findIndex(r => r.id === message.roomId);
        if (idx === -1)  {
          this.roomService.getByRoomId(message.roomId)
            .subscribe(room => {
              room.lastMessage = message;
              this.roomService.rooms.unshift(room);
            }, httpErrorResponse => {
              this.notificationService.showError(httpErrorResponse.error.message, 'Error loading room. Refreshing now');
              this.roomService.refreshRooms();
            });
          this.playNotification();
          return;
        } else {
            this.roomService.rooms[idx].lastMessage = message;
            if (this.roomService.rooms[idx].messages) {
              const idj = this.roomService.rooms[idx].messages.findIndex(m => m.id == message.id);
              if (idj === -1) {
                this.roomService.rooms[idx].messages.unshift(message);
                this.playNotification();
                if (this.selectedRoom && (this.selectedRoom.id === message.roomId)) {
                  this.messageService.setLastSeenByRoomIdForUserId(this.selectedRoom.id, message.id)
                    .subscribe(() => { },
                    httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error setting info about last seen message'));
                }
              }
            }
        }
      });

    if (!this.signalRService.onStartTypingListener)
      this.signalRService.addOnStartTypingListener((roomId, username) => {
        const idx = this.typingUsernames.findIndex(u => u === username);
        if (idx == -1 && this.selectedRoom && this.selectedRoom.id === roomId) {
          this.typingUsernames.push(username);
          this.typingSubject.next(this.typingUsernames);
        }
      });

    if (!this.signalRService.onStopTypingListener)
      this.signalRService.addOnStopTypingListener((roomId, username) => {
        const idx = this.typingUsernames.findIndex(u => u === username);
        if (idx > -1 && this.selectedRoom.id === roomId) {
          this.typingUsernames.splice(idx, 1);
          this.typingSubject.next(this.typingUsernames);
        }
      });

    if (!this.signalRService.onUpdateLastSeenMessageId)
      this.signalRService.addOnUpdateLastSeenMessageId((roomId, userId, messageId) => {
        this.roomService.rooms.forEach(r => {
          if (r.id === roomId) {
            r.members.forEach(m => {
              if (m.id === userId) {
                m.lastMessageSeenId = messageId;
              }
            })
          }
        })
      });
  }

  formatter = (user: User) => user.username;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length > 30)
          return of([]);

        return this.searchService.getUsersByTerm(term).pipe(
          catchError(() => of([]))
        )
      }),
      map(userSearch => userSearch
        .filter(u => u.id !== this.userService.currentUserValue.id))        
    )
    
  getTableData() {
    var tableData = this.roomService.rooms.sort((r1, r2)=> {
      if (!r1.lastMessage && !r2.lastMessage)
        return 0;
      
      if (!r1.lastMessage)
        return 1;

      if (!r2.lastMessage)
        return -1;
      
      return new Date(r2.lastMessage.sent).getTime() - new  Date(r1.lastMessage.sent).getTime();
    });

    if (!tableData)
      return [];

    if (!this.searchTerm)
      return tableData;

      return tableData
        .filter(userRoom => userRoom.displayName.toLowerCase().startsWith(this.searchTerm.toLowerCase()));
  }

  addPrivateChat() {
    const idx = this.roomService.rooms.findIndex(r => r.displayName === this.user.username);
    if (idx > -1) {
      this.notificationService.showInfo(`It seems that you already have chat room with ${this.user.username}.`, '');
      this.user = null;
      return;
    }

    this.roomService.createPrivate(this.user.id)
      .subscribe(room => {
        if (room) {
          this.notificationService.showSuccess('Chat successfully created.', '');
          this.user = null;
          room.messages = [];
          this.selectedRoom = room;
        }
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error creating chat'));
      this.modalService.dismissAll();
  }

  addMember(user: User) {
    const idx = this.members.findIndex(m => m.id === user.id);
    if (idx === -1)
      this.members.push(user);
    else
      this.notificationService.showInfo('User is already added to the group', '');
    this.user = null;
  }

  removeMember(user: User) {
    const idx = this.members.findIndex(m => m.id === user.id);
    this.members.splice(idx, 1);
  }

  addGroupChat() {
    this.members.unshift(this.userService.currentUserValue);
    const memberKeys = this.members.map(({ id }) => id);
    this.roomService.createGroup(this.groupName, memberKeys)
      .subscribe(room => {
        if (room) {
          this.notificationService.showSuccess('Chat successfully created.', '');
          this.user = null;
          this.members = null;
          this.groupName = null;
          room.messages = [];
          this.selectedRoom = room;
        }
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error creating chat'));
      this.modalService.dismissAll();
  }

  openRoom(room: UserRoom) {
    if (!room.messages) {
      this.isLoading = true;
      this.messageService.getByUserIdForUserId(room.id)
        .subscribe(messages => {
          room.messages = messages;
          this.isLoading = false;
        }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error loading messages'));
    }
    this.selectedRoom = room;
    if (room.lastMessage) {
      var oldLastMessageSeenId = this.getMe(room).lastMessageSeenId;
      var newLastMessageSeenId = room.lastMessage.id;
      if (newLastMessageSeenId !== oldLastMessageSeenId) {
        this.getMe(room).lastMessageSeenId = room.lastMessage.id;
        this.messageService.setLastSeenByRoomIdForUserId(room.id, room.lastMessage.id)
          .subscribe(() => { },
          httpErrorResponse => {
            this.getMe(room).lastMessageSeenId = oldLastMessageSeenId;
            this.notificationService.showError(httpErrorResponse.error.message, 'Error setting info about last seen message')
          });
      }
    }
  }

  sendMessage(room: UserRoom) {
    this.messageService.send(this.selectedRoom.id, this.messageText)
      .subscribe(message => {
        this.selectedRoom.messages.unshift(message);
        this.selectedRoom.lastMessage = message;
        var oldLastMessageSeenId = this.getMe(room).lastMessageSeenId;
        this.getMe(room).lastMessageSeenId = room.lastMessage.id;
        this.messageService.setLastSeenByRoomIdForUserId(this.selectedRoom.id, message.id)
              .subscribe(() => { },
              httpErrorResponse => {
                this.getMe(room).lastMessageSeenId = oldLastMessageSeenId;
                this.notificationService.showError(httpErrorResponse.error.message, 'Error setting info about last seen message')
              });
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error sending message'));
    this.messageText = null;
    this.signalRService.notifyStopTyping(this.selectedRoom.id, this.userService.currentUserValue.username);
  }

  getMe(room: UserRoom) {
    const idx = room.members.findIndex(m => m.username === this.userService.currentUserValue.username);
    return room.members[idx];
  }

  getOtherGuy(room: UserRoom) {
    return this.getOtherMembers(room)[0];
  }

  getOtherMembers(room: UserRoom) {
    return room.members.filter(u => u.id !== this.userService.currentUserValue.id);
  }

  isOnline(room: UserRoom) {
    const otherMembers = this.getOtherMembers(room);
    for (let i = 0; i < otherMembers.length; i++) {
      if (otherMembers[i].isConnected)
        return true;
    }  
    return false;
  }

  isGroup(room: UserRoom) {
    return room.members.length > 2;
  }

  isSelf(message: Message) {
    return message.username === this.userService.currentUserValue.username
  }

  hasNewMessages(room: UserRoom) {
    if (!room.lastMessage)
      return false;
    return room.lastMessage.id > this.getMe(room).lastMessageSeenId;
  }

  hasBeenSeen(room: UserRoom, message: Message) {
    let otherMembers = this.getOtherMembers(room);
    for (let i = 0; i < otherMembers.length; i++) {
      if (otherMembers[i].lastMessageSeenId >= message.id)
        return true;
    }
    return false;
  }

  getSeenInfoForMessage(room: UserRoom, message: Message) {
    let seen = 'Seen by';
    let otherMembers = this.getOtherMembers(room);
    for (let i = 0; i < otherMembers.length; i++) {
      if (otherMembers[i].lastMessageSeenId >= message.id)
        seen = `${seen} ${otherMembers[i].username},`;
    }
    return seen.slice(0, -1);
  }

  notifyTyping() {
    if (this.messageText) {
      this.signalRService.notifyStartTyping(this.selectedRoom.id, this.userService.currentUserValue.username);
      return;
    }
    this.signalRService.notifyStopTyping(this.selectedRoom.id, this.userService.currentUserValue.username);
  }

  utcToLocal(date: Date) {
    return new Date(new Date(date).getTime() - (new Date()).getTimezoneOffset()*60*1000);
  }

  playNotification(){
    let audio = new Audio();
    audio.src = "../../../assets/notification.mp3";
    audio.load();
    audio.play();
  }

  openModal(content: any) {
    this.user = null;
    this.members = [ this.userService.currentUserValue ];
    this.groupName = null;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic', scrollable: false, centered: true });
  }
}
