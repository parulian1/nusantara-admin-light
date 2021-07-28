import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

  public doService() {

    return this.httpClient.get(
      '/api/catalog/reindex-product/'
    );
  }

  public reindexStock() {
    return this.httpClient.get(
      '/api/fulfillment/reindex-stock-receiving-order/'
    );
  }

  public reindexStockApproved() {
    return this.httpClient.get(
      '/api/fulfillment/reindex-stock-receiving-order/'
    );
  }

  public reindexReference() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-references/'
    );
  }

  public reindexVendor() {
    return this.httpClient.get(
      '/api/catalog/reindex-vendor/'
    );
  }

  public reindexCategory() {
    return this.httpClient.get(
      '/api/catalog/reindex-category/'
    );
  }
  public reindexProductClass() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-class/'
    );
  }
  public reindexProductImage() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-images/'
    );
  }
  public reindexPriceList() {
    return this.httpClient.get(
      '/api/catalog/reindex-product-prices/'
    );
  }


  public republishUsers() {
    return this.httpClient.get(
      '/api/iam/reindex/users/'
    );
  }

  public republishCustomerGroup() {
    return this.httpClient.get(
      '/api/iam/reindex/customer-groups/'
    );
  }

  public googleDataFeed() {
    return this.httpClient.get(
      '/api/catalog/feed-data/google/'
    );
  }
}
