import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { IReview } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService extends AbstractCrudService<IReview> {

  protected baseUrl = '/api/order/review';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
