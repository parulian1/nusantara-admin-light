import {Injectable} from '@angular/core';
import {AbstractChoiceResolver} from '../../../core';
import {AuthSocialService} from '../../../services';

@Injectable({
  providedIn: 'root'
})
export class AuthSocialTypeResolver extends AbstractChoiceResolver {
  constructor(protected service: AuthSocialService) {
    super('authType');
  }
}
