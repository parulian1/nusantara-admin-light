import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  AbstractCrudService,
  ErrorResult,
  HttpStatusCode,
  IResultResponse,
  SuccessResult
} from '@nusantara/core';
import { shipment } from '@nusantara/models';
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { IError } from "@nusantara/models/base/error";


@Injectable({
  providedIn: 'root'
})
export class ShipmentService extends AbstractCrudService<shipment.IShipment> {

  baseUrl = '/api/fulfillment/shipment';
  createConnoteUrl = '/api/fulfillment/create-awb';
  httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  createAWB(requestData: object): Observable<IResultResponse> {
    return this.httpClient.post(`${this.createConnoteUrl}/`, requestData, {observe: 'response', responseType: 'json'})
      .pipe(map((response) => {
        if (response.status === HttpStatusCode.CREATED) {
          return new SuccessResult([], response.body);
        } else {
          return new ErrorResult<IError>(response.body as IError, response.status);
        }
      }),
        catchError(err => {
        if (err instanceof HttpErrorResponse) {
          return of(new ErrorResult<IError>(err.error, err.status));
        } else {
          return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
        }
      }));

  }

}
