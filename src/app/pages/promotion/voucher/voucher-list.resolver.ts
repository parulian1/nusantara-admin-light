import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { VoucherService } from '@nusantara/services';
import { IVoucher } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class VoucherListResolver extends AbstractListResolver<IVoucher> {
  constructor(service: VoucherService) { super(service); }
}
