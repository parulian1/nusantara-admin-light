import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private client: HttpClient) { }

  /**
   * Attempts to log an employee is with their username + password.
   * @param username
   * @param rawPassword
   */
  public tryLogin(username: string, rawPassword: string): Observable<boolean> {
    return of(false);
  }
}
