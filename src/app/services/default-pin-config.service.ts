import {AbstractCrudService} from '@nusantara/core';
import {IDefaultPinConfig} from '@nusantara/models/default-pin-config';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultPinConfigService extends AbstractCrudService<IDefaultPinConfig> {

  baseUrl = '/api/iam/default-pin';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
