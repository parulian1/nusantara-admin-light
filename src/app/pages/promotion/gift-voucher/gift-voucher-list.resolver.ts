import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { GiftVoucherService } from '@nusantara/services';
import { IGiftVoucher } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class GiftVoucherListResolver extends AbstractListResolver<IGiftVoucher> {
  constructor(service: GiftVoucherService) { super(service); }
}
