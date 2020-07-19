import { Component, OnDestroy } from '@angular/core';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { User } from './models/user';
import { SignalRService } from './services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  public currentUser: User;
  public isMenuCollapsed = true;

  constructor(
    private userService: UserService,
    private signalRService: SignalRService) {
    
  }
  ngOnDestroy(): void {
    this.signalRService.stop();
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(currentUser => {
      this.currentUser = currentUser;
      if (currentUser && currentUser.token)
        this.signalRService.startConnection();
    })
  }

  public logout() {
    this.userService.deauthenticate();
    this.signalRService.stop();
  }
}
