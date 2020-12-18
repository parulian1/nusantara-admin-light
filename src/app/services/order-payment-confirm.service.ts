import {Injectable, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AbstractCrudService, getSlugFromHref} from '@nusantara/core';
import { order } from '@nusantara/models';
import { forkJoin, Observable } from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {PaymentGatewayService} from '@nusantara/services/payment-gateway.service';

@Injectable({
  providedIn: 'root'
})
export class OrderPaymentConfirmService extends AbstractCrudService<order.IOrderPaymentConfirm> {
  baseUrl = '/api/order/';

  constructor(
    protected httpClient: HttpClient,
    protected paymentGatewayService: PaymentGatewayService,
  ) {
    super(httpClient);
  }

  fetchAllWithPaymentGateway(query?: string): Observable<order.IOrderPaymentConfirm[]> {
    return this.fetchAll(query).pipe(
      switchMap((orderPaymentConfirms) => {
        return forkJoin(
          orderPaymentConfirms.map(orderPayment => {
            return this.paymentGatewayService.fetch(getSlugFromHref(orderPayment.transferTo)).pipe(
              map(paymentGateway => ({...orderPayment, paymentGateway }))
            );
          }),
        );
      })
    );
  }
}
