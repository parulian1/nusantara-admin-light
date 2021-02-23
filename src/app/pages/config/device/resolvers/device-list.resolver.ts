import { Injectable } from '@angular/core';

import { DeviceService } from '@nusantara/services';
import { device } from '@nusantara/models';
import { AbstractListResolver } from '@nusantara/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceListResolver extends AbstractListResolver<device.IDevice> {
  constructor(service: DeviceService) { super(service); }

}
