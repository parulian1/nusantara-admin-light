import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractCrudService} from '@nusantara/core';
import {IKgxWms} from '@nusantara/models/integrations/kgx-wms';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KgxWmsService {
  protected httpClient: HttpClient;
  protected baseUrl = '/api/fulfillment/integration';
  protected keyBackend = 'kgx';
  public readonly maxPageSize = 250;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  fetch(): Observable<IKgxWms> {
    const url = `${this.baseUrl}/${this.keyBackend}/`;

    return this.httpClient
      .get<IKgxWms>(`${url}`, {observe: 'body', responseType: 'json'});
  }


}
