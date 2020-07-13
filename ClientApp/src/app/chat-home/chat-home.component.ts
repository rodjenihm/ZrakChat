import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoomService } from '../services/room.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { Message } from '../models/message';
import { UserRoom } from '../models/user.room';
import { MessageService } from '../services/message.service';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.css']
})
export class ChatHomeComponent implements OnInit {
  user: User;
  searchTerm = '';
  room: UserRoom;
  message;
  isLoading = false;

  constructor(
    public roomService: RoomService,
    public userService: UserService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    public searchService: SearchService,
    public signalRService: SignalRService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
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
        //.filter(item1 => !this.contactService.contacts.some(item2 => (item2.id === item1.id && item2.username === item1.username))))
    )
    
  getTableData() {
    var tableData = this.roomService.rooms;

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
    this.room = room;
  }

  sendMessage() {
    this.messageService.send(this.room.id, this.message)
      .subscribe(message => {
        this.room.messages.unshift(message);
        this.room.lastMessage = message;
        this.signalRService.notifySendMessage(message);
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error sending message'));
    this.message = null;
  }

  openNewPrivateChatModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic', scrollable: false, centered: true });
  }
}
