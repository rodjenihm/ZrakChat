import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private http: HttpClient) { }

  getUsersByTerm(term): Observable<User[]> {
    if (term === '')
      return of([]);

    return this.http.get<User[]>(`${environment.apiUrl}/users/searchByTerm`, { observe: 'body', params: { "term": term } });
  }
}
