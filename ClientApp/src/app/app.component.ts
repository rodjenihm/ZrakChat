import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public currentUser: User;
  public isMenuCollapsed = true;

  constructor(
    private userService: UserService) {
    //userService.authenticate('rodjenihm', '111111').subscribe(() => {
    //  this.notificationService.showSuccess('Enjoy your stay.', 'Login successful');
    //}, httoErrorResponse => console.log(httoErrorResponse.error.message))
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(currentUser => this.currentUser = currentUser);
  }

  public logout() {
    this.userService.deauthenticate();
  }
}
