import { Injectable } from '@angular/core';
import { UserRoom } from '../models/user.room';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  rooms: UserRoom[] = [];

  dataLoaded = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService) {
    this.refreshRooms();
  }

  refreshRooms() {
    this.get()
      .subscribe(rooms => {
        console.log(rooms);
        this.rooms = rooms;
        this.dataLoaded = true;
      }, httoErrorResponse => {
        this.dataLoaded = true;
        this.notificationService.showError(httoErrorResponse.error.message, 'Error loading rooms');
      })
  }

  createPrivate(objectId) {
    return this.http.post<UserRoom>(`${environment.apiUrl}/rooms/createPrivate`, { creatorId: this.userService.currentUserValue.id, objectId: objectId }, { observe: 'body' })
      .pipe(
        map(room => {
          if (room) {
            this.rooms.push(room);
            return room;
          }
          return null;
        })
      );
  }

  //delete(contactId) {
  //  return this.http.post(`${environment.apiUrl}/contacts/delete`, { userId: this.userService.currentUserValue.id, contactId: contactId }, { observe: 'response' })
  //    .pipe(
  //      map(response => {
  //        if (response.status == 200) {
  //          const idx = this.rooms.findIndex(c => c.id === contactId);
  //          this.rooms.splice(idx, 1);
  //          return true;
  //        }
  //        return false;
  //      })
  //    );
  //}

  get() {
    return this.http.get<UserRoom[]>(`${environment.apiUrl}/rooms/getActiveByUserId`, { observe: 'body', params: { "userId": this.userService.currentUserValue.id } });
  }

  getByRoomId(roomId) {
    return this.http.get<UserRoom>(`${environment.apiUrl}/rooms/getActiveByUserIdAndRoomId`,
     { observe: 'body', params: { "userId": this.userService.currentUserValue.id, "roomId": roomId } });
  }
}
