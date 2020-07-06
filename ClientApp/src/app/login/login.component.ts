import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Credentials } from '../models/credentials';
import { NotificationService } from '../services/notification.service';
import { error } from 'protractor';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  inProgress = false;

  loginForm: FormGroup;
  credentials: Credentials = { username: '', password: '' };

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
    if (userService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(this.credentials.username, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]),
      password: new FormControl(this.credentials.password, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  login(credentials: Credentials) {
    this.inProgress = true;
    this.userService.authenticate(credentials.username, credentials.password)
      .subscribe(() => {
        this.inProgress = false;
        this.notificationService.showSuccess('Enjoy your stay.', 'Login successful');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl ? returnUrl : '']);
      }, httoErrorResponse => {
        this.inProgress = false;
        this.notificationService.showError(httoErrorResponse.error.message, 'Login failed');
      })
  }
}
