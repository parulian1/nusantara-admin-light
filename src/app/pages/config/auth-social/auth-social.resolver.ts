import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {IAuthSocial} from '@nusantara/models/auth-social';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {AuthSocialService} from '../../../services/auth-social.service';

@Injectable({
  providedIn: 'root',
})
export class AuthSocialResolver implements Resolve<IAuthSocial> {

  constructor(private service: AuthSocialService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAuthSocial> {
    const slug = route.paramMap.get('slug');
    return this.service.fetch(slug);
  }
}
