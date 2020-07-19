import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  connectionId;

  constructor(
    private roomService: RoomService,
    private signalRService: SignalRService) {
  }
  ngOnDestroy(): void {
    this.signalRService.stop();
  }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addOnSendMessageListener((message) => {
      const idx = this.roomService.rooms.findIndex(r => r.id === message.roomId);
      if (idx === -1)  {
        this.roomService.refreshRooms();
	      this.playNotification();
        return;
      } else {
	        this.roomService.rooms[idx].lastMessage = message;
            if (this.roomService.rooms[idx].messages)
              this.roomService.rooms[idx].messages.unshift(message);
	        this.playNotification();
      }
    });

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
  }

  playNotification(){
    let audio = new Audio();
    audio.src = "../../../assets/notification.mp3";
    audio.load();
    audio.play();
  }
}
