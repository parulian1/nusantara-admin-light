import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  private _credentials: Credentials | null = null;
  private jwtHelper = new JwtHelperService();

  constructor() {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  get token(): string | null {
    if (this.isAuthenticated()) {
      return this._credentials.token;
    }
  }

  get refreshToken(): string | null {
    if (this.isAuthenticated()) {
      return this.credentials.refresh;
    }
  }

  get isExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.token);
  }

  get expiresDate(): Date | null {
    return this.jwtHelper.getTokenExpirationDate(this.token);
  }

  get claims(): Claims | null {
    return this.jwtHelper.decodeToken(this.token);
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

}

export interface Claims {
  token_type: "refresh" | "access";
  exp: number;
  jti: string;
  user_id: number;
  is_staff: boolean;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Credentials {
  token: string;
  refresh: string;
}
