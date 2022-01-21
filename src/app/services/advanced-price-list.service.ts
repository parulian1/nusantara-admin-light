import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {AbstractCrudService} from '@nusantara/core';
import {IAdvancedPriceList} from '@nusantara/models/products/advanced-price-list';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AdvancedPriceListService extends AbstractCrudService<IAdvancedPriceList> {
  baseUrl = '/api/catalog/advance-price';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  search_by_product_slug(slug: string): Observable<Array<IAdvancedPriceList>> {
    return this.httpClient.get<Array<IAdvancedPriceList>>(
      `${this.baseUrl}/?product_slug=${slug}`,
      {
        observe: 'body',
        responseType: 'json'
      }
    );
  }

}
