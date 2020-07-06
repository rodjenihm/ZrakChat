import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  inProgress = false;

  registerForm: FormGroup;
  user = { username: '', displayName: '', password: '' };

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private formBuilder: FormBuilder) {
    if (userService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  get username() { return this.registerForm.get('username'); }
  get displayName() { return this.registerForm.get('displayName'); }
  get password() { return this.registerForm.get('password'); }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: new FormControl(this.user.username, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]),
      displayName: new FormControl(this.user.displayName, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]),
      password: new FormControl(this.user.password, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  register(user: User) {
    this.inProgress = true;
    this.userService.register(user).subscribe(() => {
      this.inProgress = false;
      this.notificationService.showSuccess('Account successfully created. You can now log in.', 'Registration successful')
      this.router.navigate(['/login']);
    }, httpErrorResponse => {
      this.inProgress = false;

      if (httpErrorResponse.status == 500) {
        this.notificationService.showError('Server error. Please try again later', 'Registration failed');
        return;
      }

      this.notificationService.showError(httpErrorResponse.error.message, 'Registration failed');
    });
  }
}
