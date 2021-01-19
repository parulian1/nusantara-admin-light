import { Injectable } from '@angular/core';
import {AbstractCrudService} from '@nusantara/core';
import {IAuthSocial} from '@nusantara/models/auth-social';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthSocialService extends AbstractCrudService<IAuthSocial> {

  baseUrl = '/api/iam/auth/settings';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
