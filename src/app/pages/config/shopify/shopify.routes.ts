import {DeviceComponent, DeviceListComponent, DeviceListResolver, DeviceResolver} from '../device';
import {ShopifyMessageListComponent} from './shopify-message-list.component';
import {ShopifyMessageListResolver} from './resolvers/shopify-message-list-resolver.service';

export const SHOPIFY_ROUTES = [
  {
    path: '',
    component: ShopifyMessageListComponent,
    resolve: {page: ShopifyMessageListResolver},
    runGuardsAndResolvers: 'always'
  },
];

