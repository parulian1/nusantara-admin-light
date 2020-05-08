import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { IUser, UserService } from './users.service';


@Injectable({
  providedIn: 'root',
})
export class UserResolverService implements Resolve<IUser> {
  constructor(private service: UserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> | Observable<never> {
    const username = route.paramMap.get('username');
    return this.service.fetch(username).pipe(
      take(1),
      mergeMap(user => {
        if (user) {
          return of(user);
        } else {
          this.router.navigate(['/users/']);
          return EMPTY;
        }
      })
    );
  }
}
