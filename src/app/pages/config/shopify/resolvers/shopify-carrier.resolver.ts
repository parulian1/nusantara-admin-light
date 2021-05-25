import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {ShopifyWebhookService} from '@nusantara/services/shopify/shopify-webhook.service';
import {IShopifyCarrier} from '@nusantara/models/shopify/shopify-carrier';
import {ShopifyCarrierService} from '@nusantara/services/shopify/shopify-carrier.service';

@Injectable({
  providedIn: 'root'
})
export class ShopifyCarrierResolver implements Resolve<IShopifyCarrier[]> {
  constructor(private service: ShopifyCarrierService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShopifyCarrier[]> {
    return this.service.fetchAll();
  }
}
