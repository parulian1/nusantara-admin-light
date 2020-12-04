import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {IRelativeChoices} from '@nusantara/models';
import {NavigationService} from '@nusantara/services/navigation.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationRelativeChoicesResolver implements Resolve<IRelativeChoices[]> {
  constructor(private service: NavigationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRelativeChoices[]> | Promise<IRelativeChoices[]> | IRelativeChoices[] {
    const slug = route.paramMap.get('slug') || '';
    return this.service.fetchRelativeChoices(slug);
  }
}
