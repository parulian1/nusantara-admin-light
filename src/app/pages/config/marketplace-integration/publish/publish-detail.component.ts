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
  template: `<h1>Publish To Marketplace</h1>
    <div class="wrapper">
      <div>
        <p>Total Product</p>
        <p class="item-value">
          {{ order?.totalProduct }}
        </p>
      </div>
      <div>
        <p>Status</p>
        <p class="item-value">
          {{ order?.receivingStatus }}
        </p>
      </div>
      <div>
        <p>Warehouse</p>
        <p class="item-value mp-primary">
          {{ order?.warehouse }}
        </p>
      </div>
      <div>
        <p>Created By</p>
        <p class="item-value">
          {{ order?.receivedBy ? order.receivedBy : '-' }}
        </p>
      </div>
      <div>
        <p>Reviewed By</p>
        <p class="item-value">
          {{ order?.approvedBy ? order.approvedBy : '-' }}
        </p>
      </div>
      <div>
        <p>Date</p>
        <p class="item-value">
          {{ order?.created | date: 'dd MMM yyyy' }}
        </p>
      </div>
    </div>
    <div class="progress-info">
      <strong
        >Publishing Your Product ({{ order?.totalRecord?.published }}/{{
          order?.totalProduct
        }})</strong
      >
      <a [routerLink]="" (click)="loadAllData()" class="error-info-button"
        >Refresh All</a
      >
    </div>
    <div>
      <nus-tabs>
        <nus-tab [title]="'List Product'">
          <div *ngIf="order?.receivingStatus == 'Error'" class="error-info">
            <strong>There are Errors When Publishing Products</strong>
            <ul>
              <li>Click "Fix" on each product below.</li>
              <li>Reconnect the stores, then click "Refresh."</li>
              <li>
                Click "Refresh" on each product or click "Refresh All" to
                reupload all products.
              </li>
            </ul>
          </div>
          <nus-pagination-child
            [page]="allProducts"
            (fetchPageNumber)="fetchAllProducts($event)"
          ></nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th>Product (UPC)</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th text-align="left">Information</th>
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
                <td>{{ product.quantity }}</td>
                <td>{{ product.sublocation }}</td>
                <td
                  [ngClass]="{
                    published: product.status === 'Published',
                    publishing: product.status === 'Publishing',
                    error: product.status === 'Error'
                  }"
                >
                  {{ product.status }}
                </td>
                <td style="text-align: left;">
                  <ng-template
                    [ngIf]="product.errorStatus === 'error_authentication'"
                    >Credentials Error</ng-template
                  >
                  <ng-template [ngIf]="product.errorStatus === 'error_metadata'"
                    >Product Data Error</ng-template
                  >
                  <ng-template [ngIf]="product.errorStatus === 'error_timeout'"
                    >Time Out Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'published'"
                    >-
                  </ng-template>
                </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            [page]="allProducts"
            (fetchPageNumber)="fetchAllProducts($event)"
          ></nus-pagination-child>
        </nus-tab>
        <nus-tab
          [title]="
            'Credentials Error (' + order?.totalRecord.errorAuthentication + ')'
          "
        >
          <div
            *ngIf="order?.totalRecord.errorAuthentication > 0"
            class="error-info error-info-action"
          >
            <div>
              <strong>You are not Connected to Some Stores</strong>
              <p>Click "Reconnect" on each stores to fix this.</p>
            </div>
            <div>
              <a
                [routerLink]=""
                (click)="fetchCredentialsError()"
                class="error-info-button"
                >Refresh</a
              >
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let shop of credentialsError?.entities">
                <td>
                  {{ shop.name }}
                </td>
                <td>{{ shop.marketplace }}</td>
                <td class="error">
                  {{ shop.status }}
                </td>
                <td>
                  <a
                    [routerLink]="['../../setup/connect', shop.slug]"
                    class="mp-primary"
                    >Reconnect</a
                  >
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
        <nus-tab
          [title]="
            'Product Data Error (' + order?.totalRecord.errorMetadata + ')'
          "
        >
          <div *ngIf="order?.totalRecord.errorMetadata > 0" class="error-info">
            <strong> {{ order?.totalRecord.errorMetadata }} Products Can't be Published</strong>
            <p>Click "Fix" on each product below.</p>
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
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
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
                <td>{{ product.quantity }}</td>
                <td>{{ product.sublocation }}</td>
                <td class="error">{{ product.status }}</td>
                <td>
                  <a
                    [routerLink]="['/catalog/products', product.slug]"
                    class="mp-primary"
                    >Fix</a
                  >
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
        <nus-tab
          [title]="'Time Out Error (' + order?.totalRecord.errorTimeout + ')'"
        >
          <div
            *ngIf="order?.totalRecord.errorTimeout > 0"
            class="error-info error-info-action"
          >
            <div>
              <strong>Unable to Publish to 1 Marketplace</strong>
              <p>
                Click "Refresh" on each product or click "Refresh All" to
                reupload all products.
              </p>
            </div>
            <div>
              <a
                [routerLink]=""
                (click)="refreshAllTimeoutError($event, receivingOrderId)"
                class="error-info-button"
                >Refresh All</a
              >
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
                <th>Quantity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
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
                <td>{{ product.quantity }}</td>
                <td>{{ product.sublocation }}</td>
                <td class="error">{{ product.status }}</td>
                <td>
                  <a
                    [routerLink]=""
                    (click)="refreshTimeoutError($event, product.identifier)"
                    class="mp-primary"
                    >Refresh</a
                  >
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
    <button [routerLink]="['../']" class="mp-control mp-primary wide">
      Done
    </button>`,
  styles: [
    `
      p,strong,li {
        margin: 8px;
      }

      a {
        color: #365dc3;
        text-decoration: underline;
      }

      .wrapper {
        padding: 20px;
        margin: 0 18px 20px 18px;
        border: solid 1px #e7e7e7;
        border-radius: 8px;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .wrapper p {
        margin: 5px 0px;
      }

      .wrapper > * {
        flex: 1;
        min-width: 0;
        margin: 10px;
      }

      .item-value {
        color: #5a5a5a;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .error {
        color: #c83228;
      }

      .publishing {
        color: #f0be00;
      }

      .published {
        color: #21a656;
      }

      .progress-info {
        padding: 20px;
        margin: 0 18px 20px 18px;
        background: #f4f4f4;
        border-radius: 8px;
      }

      .progress-info :first-child {
        margin-right: 20px;
      }

      .error-info {
        padding: 20px;
        background: #ffe9e8;
        color: #c83228;
        border-radius: 8px;
      }

      .error-info-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .error-info-button {
        color: #365dc3;
        font-weight: 700;
        text-decoration: none;
        margin-right: 10px;
      }

      .mp-primary {
        color: #365dc3;
      }

      button.mp-control {
        border: 1px solid;
        border-radius: 4px;
        color: white;
        line-height: 36px;
        font-weight: 700;
        font-size: 14px;
        text-decoration: none;
      }

      button.mp-primary {
        cursor: pointer;
        background: #365dc3;
        border-radius: 4px;
      }

      button.wide {
        padding: 0 60px;
      }

      button {
        float: right;
        margin-right: 12px;
      }

      table {
        box-shadow: none;
        border: 3px solid #f4f4f4;
        border-collapse: separate;
        border-radius: 8px;
        border-spacing: 0;
        margin-bottom: 10px;
      }

      thead {
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
        background: #f4f4f4;
        color: #5a5a5a;
      }

      th {
        padding: 16px;
      }

      td {
        padding: 18px;
      }
    `,
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
