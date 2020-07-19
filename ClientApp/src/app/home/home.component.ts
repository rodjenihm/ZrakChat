import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;

  constructor(
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
  }
}
