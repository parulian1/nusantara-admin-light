import {AbstractDetailResolver} from '@nusantara/core';
import {IDefaultPinConfig} from '@nusantara/models/default-pin-config';
import {DefaultPinConfigService} from '@nusantara/services/default-pin-config.service';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export  class DefaultPinConfigResolver extends AbstractDetailResolver<IDefaultPinConfig> {
  constructor(service: DefaultPinConfigService) { super(service); }
}
