import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedResponse, ToastLevelEnum, ToastService } from '@nusantara/core';
import {
  IReceivingOrderDetail,
  IReceivingProduct,
  IShopErrorDetail,
} from '@nusantara/models';
import { MarketplaceReceivingProductsService } from '@nusantara/services';

@Component({
  selector: 'nus-marketplace-publish',
  template: `
    <h1 class="title-1">Publish To Marketplace</h1>
    <div class="wrapper">
      <div>
        <p class="body-2">Total Product</p>
        <p class="subheading-2"> {{ order?.totalProduct }} </p>
      </div>
      <div>
        <p class="body-2">Status</p>
        <p class="subheading-2"> {{ order?.receivingStatus }} </p>
      </div>
      <div>
        <p class="body-2">Warehouse</p>
        <p class="subheading-2 warehouse"> {{ order?.warehouse }} </p>
      </div>
      <div >
        <p class="body-2">Created By</p>
        <p class="subheading-2"> {{ order?.receivedBy ? order.receivedBy : '-' }} </p>
      </div>
      <div>
        <p class="body-2">Reviewed By</p>
        <p class="subheading-2"> {{ order?.approvedBy ? order.approvedBy : '-' }} </p>
      </div>
      <div>
        <p>Date</p>
        <p class="subheading-2"> {{ order?.created | date: 'dd/MM/yyyy HH:mm:ss' }} </p>
      </div>
    </div>
    <div class="progress-info">
      <span class="subheading-1">
        Publishing Your Product ({{ order?.totalRecord?.published }}/{{order?.totalProduct}})
      </span>
      <a [routerLink]="" (click)="loadAllData()">Refresh All</a>
    </div>
    <div>
      <nus-tabs>
        <nus-tab [title]="'List Product'">
          <div *ngIf="order?.receivingStatus == 'Error'" class="error-info">
            <div>
              <h2 class="heading-2">There are Errors When Publishing Products</h2>
              <ul>
                <li>Go to "Product Data Error" tab and click "Fix" on each product"</li>
                <li>Go to "Credentials Error" tab, reconnect the stores, then click "Refresh"</li>
                <li>
                  Go to "Time Out Error" tab and click "Refresh" on each product or "Refresh All" to reupload all products.
                </li>
              </ul>
            </div>
          </div>
          <nus-pagination-child
            *ngIf="allProducts?.entities?.length"
            [page]="allProducts"
            (fetchPageNumber)="fetchAllProducts($event)">
          </nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th>Product (UPC)</th>
                <th>SKU</th>
                <th class="numeric">Quantity</th>
                <th>Store</th>
                <th>Location</th>
                <th>Status</th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of allProducts?.entities">
                <td>
                  <a [routerLink]="['/catalog/products', product.slug]"> 
                    <div>{{ product.name}}</div>
                    <div>({{ product.sku }})</div> 
                  </a>
                </td>
                <td>{{ product.sku }}</td>
                <td class="numeric">{{ product.quantity }}</td>
                <td>{{ product.store }}</td>
                <td>{{ product.sublocation }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': product.status === 'Published',
                    'alert': product.status === 'Publishing',
                    'error': product.status === 'Error' }">
                    {{ product.status }}
                  </span>
                </td>
                <td>
                  <ng-template [ngIf]="product.errorStatus === 'error_authentication'">
                    Credentials Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'error_metadata'">
                    Product Data Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'error_timeout'">
                    Time Out Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'published'">-</ng-template>
                </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="allProducts?.entities?.length"
            [page]="allProducts"
            (fetchPageNumber)="fetchAllProducts($event)">
          </nus-pagination-child>
        </nus-tab>
        <nus-tab [title]="'Credentials Error (' + order?.totalRecord.errorAuthentication + ')'">
          <div *ngIf="order?.totalRecord.errorAuthentication > 0" class="error-info">
            <div>
              <h2 class="heading-2">You are not Connected to Some Stores</h2>
              <p>Click "Reconnect" on each stores to fix this.</p>
            </div>
            <div>
              <a [routerLink]="" (click)="fetchCredentialsError()">Refresh</a>
            </div>
          </div>
          <nus-pagination-child
            *ngIf="credentialsError?.entities?.length"
            [page]="credentialsError"
            (fetchPageNumber)="fetchCredentialsError($event)"
          ></nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Marketplace</th>
                <th>Status</th>
                <th class="centered">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let shop of credentialsError?.entities">
                <td> {{ shop.name }} </td>
                <td>{{ shop.marketplace }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': shop.status === 'Published',
                    'alert': shop.status === 'Publishing',
                    'error': shop.status === 'Error' }">
                    {{ shop.status }}
                  </span>
                </td>
                <td class="centered">
                  <a [routerLink]="['/config', 'marketplace-integration', 'connect', shop.slug]">Reconnect</a>
                </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="credentialsError?.entities?.length"
            [page]="credentialsError"
            (fetchPageNumber)="fetchCredentialsError($event)"
          ></nus-pagination-child>
        </nus-tab>
        <nus-tab [title]="'Product Data Error (' + order?.totalRecord.errorMetadata + ')'">
          <div *ngIf="order?.totalRecord.errorMetadata > 0" class="error-info">
            <div>
              <h2 class="heading-2"> {{ order?.totalRecord.errorMetadata }} Products Can't be Published</h2>
              <p>Click "Fix" on each product below.</p>
            </div>          
          </div>
          <nus-pagination-child
            *ngIf="dataError?.entities?.length"
            [page]="dataError"
            (fetchPageNumber)="fetchDataError($event)"
          ></nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th>Product (UPC)</th>
                <th>SKU</th>
                <th class="numeric">Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th class="centered">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of dataError?.entities">
                <td>
                  <a [routerLink]="['/catalog/products', product.slug]"> 
                    <div>{{ product.name}}</div>
                    <div>({{ product.sku }})</div> 
                  </a>
                </td>
                <td>{{ product.sku }}</td>
                <td class="numeric">{{ product.quantity }}</td>
                <td>{{ product.sublocation }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': product.status === 'Published',
                    'alert': product.status === 'Publishing',
                    'error': product.status === 'Error' }">
                    {{ product.status }}
                  </span>
                </td>
                <td class="centered">
                  <a [routerLink]="['/catalog/products', product.slug]">Fix</a>
                </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="dataError?.entities?.length"
            [page]="dataError"
            (fetchPageNumber)="fetchDataError($event)"
          ></nus-pagination-child>
        </nus-tab>
        <nus-tab [title]="'Time Out Error (' + order?.totalRecord.errorTimeout + ')'">
          <div *ngIf="order?.totalRecord.errorTimeout > 0" class="error-info">
            <div>
              <h2 class="heading-2">Unable to Publish to {{ order?.totalRecord.errorTimeout }} Marketplace</h2>
              <p>Click "Refresh" on each product or click "Refresh All" to reupload all products.</p>
            </div>
            <div>
              <a [routerLink]="" (click)="refreshAllTimeoutError($event, receivingOrderId)">Refresh All</a>
            </div>
          </div>
          <nus-pagination-child
            *ngIf="timeoutError?.entities?.length"
            [page]="timeoutError"
            (fetchPageNumber)="fetchTimeoutError($event)"
          ></nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th>Product (UPC)</th>
                <th>SKU</th>
                <th class="numeric">Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th class="centered">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of timeoutError?.entities">
                <td>
                  <a [routerLink]="['/catalog/products', product.slug]"> 
                    <div>{{ product.name}}</div>
                    <div>({{ product.sku }})</div> 
                  </a>
                </td>
                <td>{{ product.sku }}</td>
                <td class="numeric">{{ product.quantity }}</td>
                <td>{{ product.sublocation }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': product.status === 'Published',
                    'alert': product.status === 'Publishing',
                    'error': product.status === 'Error' }">
                    {{ product.status }}
                  </span>
                <td class="centered">
                  <a [routerLink]="" (click)="refreshTimeoutError($event, product.identifier)">Refresh</a>
                </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="timeoutError?.entities?.length"
            [page]="timeoutError"
            (fetchPageNumber)="fetchTimeoutError($event)"
          ></nus-pagination-child>
        </nus-tab>
      </nus-tabs>
    </div>
    <button [routerLink]="['../']" class="control">Back</button>
  `,
  styles: [
    `
      .wrapper {
        padding: 20px 24px;
        margin-bottom: 20px;
        border: solid 1px var(--grey);
        border-radius: 4px;

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        grid-row-gap: 20px;

      }
    `,
    '.wrapper > div { flex: 1; min-width: 0; }',
    '.wrapper p { color: var(--darken-grey); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.wrapper .warehouse{ color: var(--quinary) }',
    '.progress-info { padding: 16px 24px; margin-bottom: 24px; background: var(--darken-white); border-radius: 4px; }',
    '.progress-info > span { margin-right: 8px; }',
    `.error-info { 
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 24px;
      background: var(--error-lighten);
      color: var(--error);
      margin: 14px 0 5px 0;
    }`,
    'ul { list-style: disc; margin-left: 20px; margin-top: 8px; }'
  ],
})
export class PublishDetailComponent implements OnInit {
  receivingOrderId: string;
  order: IReceivingOrderDetail;
  allProducts: PagedResponse<IReceivingProduct>;
  credentialsError: PagedResponse<IShopErrorDetail>;
  dataError: PagedResponse<IReceivingProduct>;
  timeoutError: PagedResponse<IReceivingProduct>;
  isReady = true;

  constructor(
    private route: ActivatedRoute,
    private service: MarketplaceReceivingProductsService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.receivingOrderId = this.route.snapshot.paramMap.get('id');
    this.loadAllData();
  }

  fetchDetail() {
    this.service.fetch(this.receivingOrderId).subscribe((detail) => {
      this.order = detail;
    });
  }

  fetchAllProducts(pageNumber?: number) {
    this.service
      .fetchProducts(pageNumber || 1, this.receivingOrderId)
      .subscribe((page) => {
        this.allProducts = page;
      });
  }

  fetchCredentialsError(pageNumber?: number) {
    this.service
      .fetchShops(pageNumber || 1, this.receivingOrderId)
      .subscribe((page) => {
        this.credentialsError = page;
      });
  }

  fetchDataError(pageNumber?: number) {
    this.service
      .fetchProducts(pageNumber || 1, this.receivingOrderId, 'error-metadata')
      .subscribe((page) => {
        this.dataError = page;
      });
  }

  fetchTimeoutError(pageNumber?: number) {
    this.service
      .fetchProducts(pageNumber || 1, this.receivingOrderId, 'error-timeout')
      .subscribe((page) => {
        this.timeoutError = page;
      });
  }

  loadAllData() {
    this.fetchDetail();
    this.fetchAllProducts();
    this.fetchCredentialsError();
    this.fetchDataError();
    this.fetchTimeoutError();
  }

  refreshTimeoutError(event, productId: number) {
    if (!this.isReady) {
      event.preventDefault();
    } else {
      this.isReady = false;
      this.service.updateTimeoutError(productId).subscribe((data) => {
        this.loadAllData();
        this.toast.addMessage(data.message, 'Success', ToastLevelEnum.success);
        this.isReady = true;
      });
    }
  }

  refreshAllTimeoutError(event, orderId: string) {
    if (!this.isReady) {
      event.preventDefault();
    } else {
      this.isReady = false;
      this.service.updateAllTimeoutError(orderId).subscribe((data) => {
        this.loadAllData();
        this.toast.addMessage(data.message, 'Success', ToastLevelEnum.success);
        this.isReady = true;
      });
    }
  }
}
