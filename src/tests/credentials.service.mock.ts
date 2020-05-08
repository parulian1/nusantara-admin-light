import { Credentials } from '../app/core/authentication/credentials.service';

export class MockCredentialsService {

  credentials: Credentials | null = {
    refresh: 'test',
    token: '123'
  };

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  setCredentials(credentials?: Credentials, _remember?: boolean) {
    this.credentials = credentials || null;
  }

}
