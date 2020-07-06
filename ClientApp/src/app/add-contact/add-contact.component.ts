import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactService } from '../services/contact.service';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { SearchService } from '../services/search.service';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  user;

  constructor(
    private contactService: ContactService,
    private notificationService: NotificationService,
    public userService: UserService,
    public searchService: SearchService,
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  formatter = (user: User) => user.username;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length > 30)
          return of([]);

        return this.searchService.getUsersByTerm(term).pipe(
          catchError(() => of([]))
        )
      }),
      map(userSearch => userSearch
        .filter(u => u.id !== this.userService.currentUserValue.id)
        .filter(item1 => !this.contactService.contacts.some(item2 => (item2.id === item1.id && item2.username === item1.username))))
    )

  addContact() {
    const idx = this.contactService.contacts.findIndex(c => c.id === this.user.id);
    if (idx > -1) {
      this.notificationService.showInfo(`User ${this.user.username} is already in the contact list.`, '');
      this.user = null;
      return;
    }

    this.contactService.create(this.user.id)
      .subscribe(result => {
        if (result) {
          this.notificationService.showSuccess('Contact successfully created.', '');
          this.user = null;
        }
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error creating contact'))
  }
}
