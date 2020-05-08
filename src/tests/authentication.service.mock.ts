import { Observable, of } from 'rxjs';

import { LoginContext } from '../app/core/authentication/authentication.service';
import { Credentials } from '../app/core/authentication/credentials.service';

export class MockAuthenticationService {

  credentials: Credentials | null = {
    token: '123',
    refresh: '456'
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      token: 'whatever',
      refresh: '123456'
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

}
