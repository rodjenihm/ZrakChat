import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor(
    private http: HttpClient,
    private userService: UserService) {
     }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

    return this.hubConnection.start()
  }

  public createConnection(connectionId) {
    return this.http.post(`${environment.apiUrl}/connections/create`, { userId: this.userService.currentUserValue.id, connectionId: connectionId }, { observe: 'body' });
  }

  public deleteConnection(connectionId) {
    return this.http.post(`${environment.apiUrl}/connections/delete`, { userId: this.userService.currentUserValue.id, connectionId: connectionId }, { observe: 'body' });
  }

  public getConnectionId() {
    return this.hubConnection.invoke('GetConnectionId');
  }
  public notifySendMessage(message) {
    this.hubConnection.invoke('SendMessage', message);
  }

  public addOnSendMessageListener = (func) => {
    this.hubConnection.on('updateMessages', (data) => {
      func(data);
    });
  }
}
