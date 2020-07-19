import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
      private http: HttpClient,
      private userService: UserService) {
     }

  getByUserIdForUserId(roomId) {
    return this.http.get<Message[]>(`${environment.apiUrl}/messages/getByRoomIdForUserId`, { observe: 'body', params: { "userId": this.userService.currentUserValue.id, "roomId": roomId } });
  }

  send(roomId, text) {
    return this.http.post<Message>(`${environment.apiUrl}/messages/send`, { userId: this.userService.currentUserValue.id, roomId: roomId, text: text }, { observe: 'body' });
  }

  setLastSeenByRoomIdForUserId(roomId, messageId) {
    return this.http.post(`${environment.apiUrl}/messages/setLastSeenByRoomIdForUserId`,
     { userId: this.userService.currentUserValue.id, roomId: roomId, messageId: messageId },
     { observe: 'response' });
  }
}
