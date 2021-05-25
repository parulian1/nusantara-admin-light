import {Injectable} from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AbstractListResolver} from '../../../../core';
import {IShopifyMessage} from '../../../../models';
import {ShopifyMessageService} from '../../../../services';

@Injectable({
  providedIn: 'root'
})
export class ShopifyMessageListResolver extends AbstractListResolver<IShopifyMessage> {
  constructor(service: ShopifyMessageService) {
    super(service);
  }

}
