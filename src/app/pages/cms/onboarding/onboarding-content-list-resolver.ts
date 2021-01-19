import {IOnBoarding} from '@nusantara/models';
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {IOnboardingService} from "@nusantara/services";

@Injectable({
  providedIn: 'root',
})
export class OnboardingContentListResolver implements Resolve<IOnBoarding[]>{
  constructor(private service: IOnboardingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOnBoarding[]> {
    return this.service.fetchAll();
  }

}
