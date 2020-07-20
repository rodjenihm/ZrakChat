import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  
  public onSendMessageListener = null;
  public onGoOnlineListener = null;
  public onGoOfflineListener = null;
  public onStartTypingListener = null;
  public onStopTypingListener = null;
  public onUpdateLastSeenMessageId = null;

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

  public stop() {
    this.hubConnection.stop();
  }
  
  public notifySendMessage(message) {
    this.hubConnection.invoke('SendMessage', message);
  }

  public notifyStartTyping(roomId, username) {
    this.hubConnection.invoke('StartTyping', roomId, username);
  }

  public notifyStopTyping(roomId, username) {
    this.hubConnection.invoke('StopTyping', roomId, username);
  }

  public addOnSendMessageListener = (func) => {
    this.onSendMessageListener += func;
    this.hubConnection.on('updateMessages', (data) => {
      func(data);
    });
  }

  public addOnGoOnlineListener = (func) => {
    this.onGoOnlineListener += func;
    this.hubConnection.on('userGoOnline', (data) => {
      func(data);
    });
  }

  public addOnGoOfflineListener = (func) => {
    this.onGoOfflineListener += func;
    this.hubConnection.on('userGoOffline', (data) => {
      func(data);
    });
  }

  public addOnStartTypingListener = (func) => {
    this.onStartTypingListener += func;
    this.hubConnection.on('userStartTyping', (roomId, username) => {
      func(roomId, username);
    });
  }

  public addOnStopTypingListener = (func) => {
    this.onStopTypingListener += func;
    this.hubConnection.on('userStopTyping', (roomId, username) => {
      func(roomId, username);
    });
  }

  public addOnUpdateLastSeenMessageId = (func) => {
    this.onUpdateLastSeenMessageId += func;
    this.hubConnection.on('updateLastSeenMessageId', (roomId, userId, messageId) => {
      func(roomId, userId, messageId);
    });
  }
}
