import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IChoice } from '@nusantara/models/drf';
import { SocialMediaService } from "@nusantara/services";


/**
 * Gets the valid "types" for payment gateway.
 */
@Injectable({
  providedIn: 'root',
})
export class SocialMediaTypeResolver implements Resolve<IChoice[]> {

  constructor(private service: SocialMediaService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> | Observable<never> {
    return this.service.getFieldChoices('type');
  }
}
