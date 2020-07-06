import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user, { observe: 'response' })
      .pipe(
        map(response => {
          return response.status === 200;
        })
      );
  }

  authenticate(username, password): Observable<Object> {
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username: username, password: password }, { observe: 'body' })
      .pipe(
        map(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return true;
        })
      );
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public deauthenticate() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
