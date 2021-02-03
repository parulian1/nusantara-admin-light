import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import {IGiftVoucher} from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class GiftVoucherService extends AbstractCrudService<IGiftVoucher> {
  baseUrl = '/api/order/gift-voucher';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
