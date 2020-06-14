import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IChoiceFieldChoice } from '@nusantara/core';
import { AbstractCrudService } from '@nusantara/core/http';

export abstract class AbstractChoiceResolver implements Resolve<IChoiceFieldChoice[]> {

  protected readonly service: AbstractCrudService<any>;
  protected readonly fieldName: string;

  protected constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IChoiceFieldChoice[]> | Observable<never> {
    return this.service.getFieldChoices(this.fieldName);
  }
}
