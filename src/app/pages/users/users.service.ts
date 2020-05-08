import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';


export interface IUserSummary {
  href: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: string;
  dateJoined: string;
}

export interface IUser {
  href: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: string;
  dateJoined: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  fetchList(): Observable<IUserSummary[]> {
    return this.httpClient.get<IUserSummary[]>('http://localhost:8000/users/', {observe: 'body', responseType: 'json'});
  }

  fetch(username: string): Observable<IUser> {
    return this.httpClient.get<IUser>(`http://localhost:8000/users/${username}/`, {observe: 'body', responseType: 'json'});
  }

}
