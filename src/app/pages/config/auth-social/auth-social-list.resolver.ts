import {AbstractListResolver} from '../../../core';
import {IAuthSocial} from '../../../models/auth-social';
import {AuthSocialService} from '../../../services';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthSocialListResolver extends AbstractListResolver<IAuthSocial>{
  constructor(service: AuthSocialService) {
    super(service);
  }
}
