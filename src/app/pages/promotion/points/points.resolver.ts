import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IPoints } from '@nusantara/models';
import { PointsService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class PointsResolver extends AbstractDetailResolver<IPoints> {
  constructor(service: PointsService) {
    super(service);
  }
}
