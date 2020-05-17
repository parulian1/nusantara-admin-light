import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public httpClient: HttpClient,
              public jwtHelper: JwtHelperService) { }


  public get isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  /**
   * Attempts to log an employee is with their username + password.
   * @param username
   * @param rawPassword
   */
  public tryLogin(username: string, rawPassword: string): Observable<boolean> {
    return of(false);
  }
}
