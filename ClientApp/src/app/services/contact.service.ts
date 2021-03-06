import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { UserContact } from '../models/user.contact';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: UserContact[] = [];

  dataLoaded = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private notificationService: NotificationService) {
    this.get()
      .subscribe(contacts => {
        this.contacts = contacts;
        this.dataLoaded = true;
      }, httoErrorResponse => {
        this.dataLoaded = true;
        this.notificationService.showError(httoErrorResponse.error.message, 'Error loading contacts');
      });
  }

  create(contactId) {
    return this.http.post<UserContact>(`${environment.apiUrl}/contacts/create`, { userId: this.userService.currentUserValue.id, contactId: contactId }, { observe: 'body' })
      .pipe(
        map(body => {
          if (body) {
            this.contacts.push(body);
            return true;
          }
          return false;
        })
      );
  }

  delete(contactId) {
    return this.http.post(`${environment.apiUrl}/contacts/delete`, { userId: this.userService.currentUserValue.id, contactId: contactId }, { observe: 'response' })
      .pipe(
        map(response => {
          if (response.status == 200) {
            const idx = this.contacts.findIndex(c => c.id === contactId);
            this.contacts.splice(idx, 1);
            return true;
          }
          return false;
        })
      );
  }

  get() {
    return this.http.get<UserContact[]>(`${environment.apiUrl}/contacts/getByUserId`, { observe: 'body', params: { "userId": this.userService.currentUserValue.id } });
  }
}
