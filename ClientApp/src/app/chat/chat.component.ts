import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';
import { RoomService } from '../services/room.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  constructor(private roomService: RoomService) { }
}
