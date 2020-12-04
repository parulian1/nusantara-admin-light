import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { device } from '@nusantara/models';
import { DeviceService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class DeviceResolver extends AbstractDetailResolver<device.IDevice> {
  constructor(service: DeviceService) { super(service); }
}
