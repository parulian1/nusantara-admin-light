import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {IShopifyWebhook} from '@nusantara/models/shopify/shopify-webhook';
import {ShopifyWebhookService} from '@nusantara/services/shopify/shopify-webhook.service';

@Injectable({
  providedIn: 'root'
})
export class ShopifyWebhookResolver implements Resolve<IShopifyWebhook[]> {

  constructor(private service: ShopifyWebhookService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IShopifyWebhook[]> {
    return this.service.fetchAll();
  }
}
