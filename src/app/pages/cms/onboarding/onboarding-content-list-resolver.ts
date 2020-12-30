import {AbstractListResolver} from '@nusantara/core';
import {IOnboardingContent} from '@nusantara/models';
import {OnboardingContentService} from '@nusantara/services/onboarding-content.service';
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OnboardingContentListResolver implements Resolve<IOnboardingContent[]>{
  constructor(private service: OnboardingContentService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOnboardingContent[]> {
    return this.service.fetchAll();
  }

}
