import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {ErrorResult} from '@nusantara/core';
import {IHttpFailure} from '@nusantara/models';

@Injectable({
  providedIn: 'root'
})
export class ReindexingService {

  protected httpClient: HttpClient;
  protected baseUrl: string;
  public readonly maxPageSize = 250;

  protected constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  doTask(slug: string): Observable<any> {
    switch (slug) {
      case 'product':
        return this.doService();
      case 'stock':
        return this.reindexStock();
      case 'approved-stock':
        return this.reindexStockApproved();
      case 'reference':
        return this.reindexReference();
      case 'vendor':
        return this.reindexVendor();
      case 'category':
        return this.reindexCategory();
      case 'product-class':
        return this.reindexProductClass();
      case 'highlight':
        return this.reindexHighlight();
      case 'product-image':
        return this.reindexProductImage();
      case 'price-list':
        return this.reindexPriceList();
      case 'users':
        return this.republishUsers();
      case 'group':
        return this.republishGroups();
      case 'customer-group':
        return this.republishCustomerGroup();
      case 'google-feed':
        return this.googleDataFeed();
    }
    return of(new ErrorResult<IHttpFailure>({detail: 'Network error.. probably?'}, 400));
  }

  public doService() {

    return this.httpClient.get(
      '/api/catalog/reindex-product/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public reindexStock() {
    return this.httpClient.get(
      '/api/fulfillment/reindex-stock-receiving-order/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public reindexStockApproved() {
    return this.httpClient.get(
      '/api/fulfillment/reindex-approved-receiving-order/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public reindexReference() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-references/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public reindexVendor() {
    return this.httpClient.get(
      '/api/catalog/reindex-vendor/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public reindexCategory() {
    return this.httpClient.get(
      '/api/catalog/reindex-category/',
      { observe: 'response', responseType: 'text'}
    );
  }
  public reindexProductClass() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-class/',
      { observe: 'response', responseType: 'text'}
    );
  }
  public reindexProductImage() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-images/',
      { observe: 'response', responseType: 'text'}
    );
  }
  public reindexPriceList() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-prices/',
      { observe: 'response', responseType: 'text'}
    );
  }


  public republishUsers() {
    return this.httpClient.get(
      '/api/iam/reindex/users/',
      { observe: 'response', responseType: 'text'}
    );
  }


  public republishGroups() {
    return this.httpClient.get(
      '/api/iam/reindex/groups/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public republishCustomerGroup() {
    return this.httpClient.get(
      '/api/iam/reindex/customer-groups/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public googleDataFeed() {
    return this.httpClient.get(
      '/api/catalog/feed-data/google/',
      { observe: 'response', responseType: 'text'}
    );
  }

  public reindexHighlight() {
    return this.httpClient.get(
      '/api/cms/reindex-highlight/',
      { observe: 'response', responseType: 'text'}
    );
  }
}
