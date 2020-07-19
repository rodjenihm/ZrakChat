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
  message;
  isLoading = false;

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

    this.signalRService.addOnGoOnlineListener((userId) => {
      this.roomService.rooms.forEach(r => {
        r.members.forEach(m => {
          if (m.id === userId)
            m.isConnected = true;
        })
      })
    });

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
  
    this.signalRService.addOnSendMessageListener((message) => {
      const idx = this.roomService.rooms.findIndex(r => r.id === message.roomId);
      if (idx === -1)  {
        this.roomService.refreshRooms();
	      this.playNotification();
        return;
      } else {
	        this.roomService.rooms[idx].lastMessage = message;
          if (this.roomService.rooms[idx].messages) {
            const idj = this.roomService.rooms[idx].messages.findIndex(m => m.id == message.id);
            if (idj === -1) {
              this.roomService.rooms[idx].messages.unshift(message);
              this.playNotification();
            }
          }
          if (this.selectedRoom && (this.selectedRoom.id === message.roomId)) 
            this.messageService.setLastSeenByRoomIdForUserId(this.selectedRoom.id, message.id)
              .subscribe(() => {},
              httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error loading messages'));
          else 
            this.roomService.rooms[idx].newMessages = true;
      }
    });

    this.signalRService.addOnStartTypingListener((roomId, username) => {
      const idx = this.typingUsernames.findIndex(u => u === username);
      if (idx == -1 && this.selectedRoom && this.selectedRoom.id === roomId) {
        this.typingUsernames.push(username);
        this.typingSubject.next(this.typingUsernames);
      }
    })

    this.signalRService.addOnStopTypingListener((roomId, username) => {
      const idx = this.typingUsernames.findIndex(u => u === username);
      if (idx > -1 && this.selectedRoom.id === roomId) {
        this.typingUsernames.splice(idx, 1);
        this.typingSubject.next(this.typingUsernames);
      }
    })
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
      .subscribe(result => {
        if (result) {
          this.notificationService.showSuccess('Chat successfully created.', '');
          this.user = null;
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
    room.newMessages = false;
    if (room.lastMessage)
      this.messageService.setLastSeenByRoomIdForUserId(room.id, room.lastMessage.id)
        .subscribe(() => {},
        httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error loading messages'));
  }

  sendMessage() {
    this.messageService.send(this.selectedRoom.id, this.message)
      .subscribe(message => {
        this.selectedRoom.messages.unshift(message);
        this.selectedRoom.lastMessage = message;
        this.messageService.setLastSeenByRoomIdForUserId(this.selectedRoom.id, message.id)
              .subscribe(() => {},
              httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error loading messages'));
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error sending message'));
    this.message = null;
    this.signalRService.notifyStopTyping(this.selectedRoom.id, this.userService.currentUserValue.username);
  }

  getOtherMembers(room) {
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

  isGroup() {
    return this.selectedRoom.members.length > 2;
  }

  notifyTyping(event) {
    if (this.message) {
      this.signalRService.notifyStartTyping(this.selectedRoom.id, this.userService.currentUserValue.username);
      return;
    }
    this.signalRService.notifyStopTyping(this.selectedRoom.id, this.userService.currentUserValue.username);
  }

  utcToLocal(date) {
    return new Date(new Date(date).getTime() - (new Date()).getTimezoneOffset()*60*1000);
  }

  playNotification(){
    let audio = new Audio();
    audio.src = "../../../assets/notification.mp3";
    audio.load();
    audio.play();
  }

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic', scrollable: false, centered: true });
  }
}
