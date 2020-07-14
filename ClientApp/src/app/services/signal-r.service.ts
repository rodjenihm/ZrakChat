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
  a = 1;

  constructor(
    private http: HttpClient,
    private userService: UserService) {
     }

  public startConnection = () => {
    const options = { 
      accessTokenFactory: () => this.userService.currentUserValue.token
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, options)
      .build();

    this.hubConnection.start()
      .then()
      .catch(error => console.log(error));
  }

  public createConnection(connectionId) {
    return this.http.post(`${environment.apiUrl}/connections/create`, { userId: this.userService.currentUserValue.id, connectionId: connectionId }, { observe: 'body' });
  }

  public deleteConnection(connectionId) {
    return this.http.post(`${environment.apiUrl}/connections/delete`, { userId: this.userService.currentUserValue.id, connectionId: connectionId }, { observe: 'body' });
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
