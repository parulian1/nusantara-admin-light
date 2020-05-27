import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILoginFailure, ITokenPair } from './models';
import { ErrorResult, IResultResponse, SuccessResult } from '@nusantara/core/responses';
import { HttpStatusCode } from '@nusantara/core/http';
import { IJwtClaims } from '@nusantara/auth/models/jwt-claims';


/**
 * Allows a user to login/logout or refresh their current token.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static readonly REFRESH_THRESHOLD = 10 * 60 * 1000;  // 10 minutes
  static readonly TOKEN_KEY = 'token';
  static readonly TOKEN_REFRESH_KEY = 'token_refresh';

  constructor(public httpClient: HttpClient,
              public jwtHelper: JwtHelperService) { }


  get token(): string {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }
  set token(value: string) {
    if (value === this.token) {
      return;
    }

    if (value === null) {
      localStorage.removeItem(AuthService.TOKEN_KEY);
    } else {
      localStorage.setItem(AuthService.TOKEN_KEY, value);
    }
  }

  /**
   * If the user is authenticated, returns the claims present in their JWT
   * payload.
   */
  get tokenPayload(): IJwtClaims {
    if (this.isAuthenticated) {
      const tokenBody = this.token.split('.')[1];
      return JSON.parse(atob(tokenBody)) as IJwtClaims;
    } else {
      return null;
    }
  }

  get refreshToken(): string {
    return localStorage.getItem(AuthService.TOKEN_REFRESH_KEY);
  }
  set refreshToken(value: string) {
    if (value === this.refreshToken) {
      return;
    }

    if (value === null) {
      localStorage.removeItem(AuthService.TOKEN_REFRESH_KEY);
    } else {
      localStorage.setItem(AuthService.TOKEN_REFRESH_KEY, value);
    }
  }

  get isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.token);
  }

  public get isAuthenticated(): boolean {
    return (this.token && !this.isTokenExpired);
  }

  /**
   * Indicates whether or not the user's auth token should be refreshed
   *
   * This check should be run during each navigation.
   *
   * This is true if the user has a valid (non-expired) token, and the token
   * will expire within REFRESH_THRESHOLD (default 10 minutes).
   */
  public get shouldRefresh(): boolean {
    if (this.canRefresh) {
      const expiryDate = this.jwtHelper.getTokenExpirationDate(this.token);
      const shouldRefreshAfterDate = new Date(expiryDate.getTime() - AuthService.REFRESH_THRESHOLD);

      return (new Date() >= shouldRefreshAfterDate);
    }
    return false;
  }

  /**
   * Indicates whether a token can be refreshed.  This is only true if:
   * 1. There is a refresh token saved to localStorage
   * 2. The current access token **is not** expired.
   */
  public get canRefresh(): boolean {
    return !(!this.refreshToken || this.isTokenExpired);
  }

  /**
   * Attempts to log an employee is with their username + password.
   *
   * @param email the user's email address.
   * @param rawPassword the user's plaintext password.
   */
  public login(email: string, rawPassword: string): Observable<IResultResponse> {
    return this.httpClient.post<ITokenPair|ILoginFailure>(
      '/api/iam/auth/login/',
      { email, password: rawPassword },
      { responseType: 'json', observe: 'response' }
      ).pipe(
        map(
          (response) => {
            if (response.status === HttpStatusCode.OK) {
              this.saveToken(response.body as ITokenPair);
              return new SuccessResult();
            } else {
              return new ErrorResult<ILoginFailure>(response.body as ILoginFailure, response.status);
            }
          }
        )
    );
  }

  /**
   * Removes the token and refresh token from the browser's localStorage.
   */
  public logout(): void {
    this.token = null;
    this.refreshToken = null;
  }

  public refresh(): Observable<boolean> {
    return of(false);
  }

  private saveToken(tokenPair: ITokenPair): void {
    this.token = tokenPair.access;
    this.refreshToken = tokenPair.refresh;
  }
}
