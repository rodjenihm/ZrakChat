import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { SearchService } from '../services/search.service';
import { ContactService } from '../services/contact.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  user;

  searchTerm = '';
  page = 1;
  pageSize = 5;
  total;

  constructor(
    public contactService: ContactService,
    public userService: UserService,
    private notificationService: NotificationService,
    public searchService: SearchService,
    private modalService: NgbModal) { }

  ngOnInit() {
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
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error creating contact'));
      this.modalService.dismissAll();
  }

  deleteContact(user) {
    this.contactService.delete(user.id)
      .subscribe(result => {
        if (result) {
          this.notificationService.showSuccess('Contact successfully deleted.', '');
        }
      }, httpErrorResponse => this.notificationService.showError(httpErrorResponse.error.message, 'Error deleting contact'))
  }

  getTableData() {
    var tableData = this.contactService.contacts;

    if (!tableData)
      return [];

    if (this.searchTerm === '') {
      this.total = tableData.length;
      return tableData
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
    else {
      tableData = tableData
        .filter(contact =>
          contact.username.toLowerCase().startsWith(this.searchTerm.toLowerCase()) ||
          contact.displayName.toLowerCase().startsWith(this.searchTerm.toLowerCase()))
      this.total = tableData.length;

      return tableData
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  openAddContactModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', scrollable: false, centered: true });
  }
}
