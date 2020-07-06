import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { SearchService } from '../services/search.service';
import { ContactService } from '../services/contact.service';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
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
          contact.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          contact.displayName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      this.total = tableData.length;

      return tableData
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    }
  }

  openAddContactModal() {
    const modalRef = this.modalService.open(AddContactComponent, { scrollable: false, centered: true });
  }
}
