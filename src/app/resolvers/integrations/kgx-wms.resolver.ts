import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {KgxWmsService} from '@nusantara/services/integrations/kgx-wms.service';
import {IKgxWms} from '@nusantara/models/integrations/kgx-wms';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KgxWmsResolver implements Resolve<IKgxWms> {

  protected readonly service: KgxWmsService;

  protected constructor(service: KgxWmsService) {
    this.service = service;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IKgxWms> {
    return this.service.fetch().pipe(catchError(err => {
      return of({} as IKgxWms);
    }));
  }
}
