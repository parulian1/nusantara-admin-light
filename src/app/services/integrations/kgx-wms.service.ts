import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractCrudService, ErrorResult, IResultResponse, SuccessCreatedResult, SuccessResult} from '@nusantara/core';
import {IKgxWms} from '@nusantara/models/integrations/kgx-wms';
import {Observable} from 'rxjs';
import {base} from '@nusantara/models';
import {map} from 'rxjs/operators';

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

  save(entity: IKgxWms | FormData, headers?: Headers): Observable<IResultResponse> {
    return this.create(entity, headers);
  }

  /**
   * Sends JSON or FormData to this service's list endpoint using HTTP POST.
   */
  create(entity: IKgxWms | FormData, headers?: any): Observable<IResultResponse> {
    return this.httpClient
      .post<IKgxWms>(`${this.baseUrl}/${this.keyBackend}/`, entity, {observe: 'response', responseType: 'json', headers})
      .pipe(map(resp => {
        if (resp.status === 201) {
          return new SuccessCreatedResult<IKgxWms>(resp.headers.get('Location'), [], resp.body);
        }
        return new ErrorResult(resp.body, resp.status);
      }));
  }


}
