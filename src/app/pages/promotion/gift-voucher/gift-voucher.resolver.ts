import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { IGiftVoucher } from '@nusantara/models';
import { GiftVoucherService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class GiftVoucherResolver extends AbstractDetailResolver<IGiftVoucher> {
  constructor(service: GiftVoucherService) { super(service); }
}
