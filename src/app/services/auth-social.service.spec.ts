import { TestBed } from '@angular/core/testing';

import { AuthSocialService } from './auth-social.service';

describe('AuthSocialService', () => {
  let service: AuthSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
