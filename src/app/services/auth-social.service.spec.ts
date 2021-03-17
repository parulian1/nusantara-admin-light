import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AuthSocialService } from './auth-social.service';

describe('AuthSocialService', () => {
  let service: AuthSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(AuthSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
