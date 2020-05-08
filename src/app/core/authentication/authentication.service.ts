import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from 'rxjs';

import {Credentials, CredentialsService} from './credentials.service';


/**
 * Provides a base for authentication workflow.\
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private credentialsService: CredentialsService, private http: HttpClient) { }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {

    let ob = this.http.post<Credentials>(
      '/auth/login/',
      {'email': context.email, 'password': context.password},
      {observe: 'body', responseType: 'json'});

    ob.subscribe(
      credentials => this.credentialsService.setCredentials(credentials, context.remember)
    );

    return ob;
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    this.credentialsService.setCredentials();
    return of(true);
  }
}

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}
