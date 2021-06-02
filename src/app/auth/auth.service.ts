import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMapTo } from 'rxjs/operators';

import { ITokenPair, IAccessToken } from './models';
import { ErrorResult, IResultResponse, SuccessResult } from '@nusantara/core/responses';
import { HttpStatusCode } from '@nusantara/core/http';
import { IJwtClaims } from '@nusantara/auth/models/jwt-claims';
import { IError } from '@nusantara/models/base/error';
import { environment } from '@env/environment';


/**
 * Allows a user to login/logout or refresh their current token.
 *
 * This service performs the responsibilities of
 * saving and fetching the user's access credentials from
 * the browser's localStorage
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

  /**
   * The user's primary JWT auth token, from the browser's localStorage.
   */
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
   * payload, otherwise returns null.
   */
  get tokenPayload(): IJwtClaims {
    if (this.isAuthenticated) {
      const tokenBody = this.token.split('.')[1];
      return JSON.parse(atob(tokenBody)) as IJwtClaims;
    } else {
      return null;
    }
  }

  /**
   * The user's refresh token saved in localStorage.
   */
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

  /**
   * Indicates if the user's JWT is expired.
   */
  get isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.token);
  }

  /**
   * Indicates if the user has a JWT **and** that JWT is not expired.
   */
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
   *
   * Even though we **can** refresh the token after expiry, because
   * this is within the scope of an admin panel, this will essentially
   * have the effect of logging out the current user after a period of
   * 10-30 minutes of inactivity.
   */
  public get canRefresh(): boolean {
    return !!this.refreshToken && !this.isTokenExpired;
  }

  /**
   * The domain (without protocol) the user is currently logged in to.
   * **ESSENTIAL** for knowing the base-url for backend API services the user
   * is currently able to access.
   */
  public get siteDomain(): string {
    return window.localStorage.getItem('site_domain');
  }
  public set siteDomain(value: string) {
    if (value === null) {
      window.localStorage.removeItem('site_domain');
    } else {
      window.localStorage.setItem('site_domain', value);
    }
  }

  /**
   * Check domain is exist or not.
   */
  public checkDomain(domain: string): Observable<any> {
    return this.httpClient.post(`${environment.apiBaseUrl}/api/iam/domain-verification/`, {
      domain
    });
  }

  /**
   * Used for checking domain first than log in user with username / email and password.
   */
  public loginWithDomainValidation(email: string, password: string, domain: string): Observable<IResultResponse> {
    return this.checkDomain(domain).pipe(
      mergeMapTo(this.login(email, password, domain)),
      catchError((err) => {
        const message = err.status === 404 ? 'Incorrect Site Domain' : err.error.detail;
        return of(
          new ErrorResult({ details: [], message }, err.status)
        );
      })
    );
  }

  /**
   * Attempts to log an employee is with their username + password.
   *
   * @param email the user's email address.
   * @param rawPassword the user's plaintext password.
   * @param authDomain the registered site domain the user will be authenticating for.
   */
  public login(email: string, rawPassword: string, authDomain: string): Observable<IResultResponse> {
    this.siteDomain = authDomain;

    // first check domain, and to login action
    return this.httpClient.post<ITokenPair|IError>(
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
                this.siteDomain = null;
                return new ErrorResult<IError>(response.body as IError, response.status);
              }
            }
          ),
          catchError((err) => {
            const message = err.status === 0 ? 'Incorrect Site Domain' : err.error.detail;
            return of(
              new ErrorResult({ details: [], message }, err.status)
            );
          })
        );
  }

  /**
   * Removes the token and refresh token from the browser's localStorage.
   */
  public logout(): void {
    this.siteDomain = null;
    this.token = null;
    this.refreshToken = null;
  }

  /**
   * Sends the 'refresh' token stored in the browser's localStorage
   * and attempts to get a new access token.
   * The saved refresh token **is not** replaced, which will cause
   * the user to eventually be logged out when this token expires.
   */
  public refresh(): Observable<IResultResponse> {
    return this.httpClient.post<IAccessToken|IError>(
      '/api/iam/auth/refresh/',
      { refresh: this.refreshToken },
      {responseType: 'json', observe: 'response'}
    ).pipe(
      map((response) => {
        if (response.status === HttpStatusCode.OK) {
          this.token = (response.body as IAccessToken).access;
          return new SuccessResult();
        } else {
          return new ErrorResult<IError>(response.body as IError, response.status);
        }
      })
    );
  }

  /**
   * Writes the token and refresh token for the user to localStorage.
   * @param tokenPair token data (returned from the auth api)
   * @private
   */
  private saveToken(tokenPair: ITokenPair): void {
    this.token = tokenPair.access;
    this.refreshToken = tokenPair.refresh;
  }

  /**
   * Attempts to submit forgot password with their email.
   *
   * @param email the user's email address.
   * @param authDomain the registered site domain the user will be authenticating for.
   */
  public forgotPassword(email: string, authDomain: string): Observable<IResultResponse> {

    this.siteDomain = authDomain;

    return this.httpClient.post<IError>(
      '/api/iam/auth/password-reset/',
      { email },
      { responseType: 'json', observe: 'response' }
      ).pipe(
        map(
          (response) => {
            if (response.status === HttpStatusCode.ACCEPTED) {
              return new SuccessResult([], response.body);
            } else {
              this.siteDomain = null;
              return new ErrorResult<IError>(response.body as IError, response.status);
            }
          }
        )
    );
  }

  /**
   * Attempts to submit reset user pin.
   *
   * @param user the user's href.
   */
  public resetPin(user: string): Observable<IResultResponse> {

    return this.httpClient.put<IError>(
      '/api/iam/auth/pin-reset/',
      { user },
      { responseType: 'json', observe: 'response' }
    ).pipe(
      map(
        (response) => {
          if (response.status === HttpStatusCode.ACCEPTED) {
            return new SuccessResult([], response.body);
          } else {
            return new ErrorResult<IError>(response.body as IError, response.status);
          }
        }
      )
    );
  }

}
