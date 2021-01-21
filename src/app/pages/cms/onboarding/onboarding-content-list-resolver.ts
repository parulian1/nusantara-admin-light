import {IOnBoarding} from '@nusantara/models';
import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OnboardingService} from "@nusantara/services";

@Injectable({
  providedIn: 'root',
})
export class OnboardingContentListResolver implements Resolve<IOnBoarding[]>{
  constructor(private service: OnboardingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOnBoarding[]> {
    return this.service.fetchAll();
  }

}
