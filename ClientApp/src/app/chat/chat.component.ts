import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  connectionId;

  constructor(
    private roomService: RoomService,
    private signalRService: SignalRService) {
  }

  ngOnInit() {
    this.signalRService.startConnection();
    //this.connectionId = await this.signalRService.getConnectionId();
    //this.signalRService.createConnection(this.connectionId).subscribe();
    this.signalRService.addOnSendMessageListener((message) => {
      const idx = this.roomService.rooms.findIndex(r => r.id === message.roomId);
      if (idx == -1)  {
        this.roomService.refreshRooms();
        return;
      }

      this.roomService.rooms[idx].lastMessage = message;
      if (this.roomService.rooms[idx].messages)
        this.roomService.rooms[idx].messages.unshift(message);
    });
  }
}
