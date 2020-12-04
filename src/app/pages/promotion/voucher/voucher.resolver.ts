import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IVoucher } from '@nusantara/models';
import { VoucherService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class VoucherResolver extends AbstractDetailResolver<IVoucher> {
  constructor(service: VoucherService) { super(service); }
}
