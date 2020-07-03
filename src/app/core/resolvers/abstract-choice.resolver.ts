import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AbstractCrudService } from '@nusantara/core';
import { IChoice } from '@nusantara/models/drf';

export abstract class AbstractChoiceResolver implements Resolve<IChoice[]> {

  protected readonly service: AbstractCrudService<any>;
  protected readonly fieldName: string;

  protected constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoice[]> | Observable<never> {
    return this.service.getFieldChoices(this.fieldName);
  }
}
