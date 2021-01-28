import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { IPoints } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class PointsService extends AbstractCrudService<IPoints> {

  baseUrl = '/api/catalog/point-config';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
