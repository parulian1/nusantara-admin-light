import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AbstractCrudService } from '@nusantara/core';
import { device } from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends AbstractCrudService<device.IDevice> {

  baseUrl = '/api/fulfillment/devices';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
