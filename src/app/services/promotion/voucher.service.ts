import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core/http';
import { IVoucher } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class VoucherService extends AbstractCrudService<IVoucher> {

  baseUrl = '/api/order/voucher';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
