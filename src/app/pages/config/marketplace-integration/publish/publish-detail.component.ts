import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagedResponse, ToastLevelEnum, ToastService } from '@nusantara/core';
import { marketplace } from '@nusantara/models';
import { MarketplaceReceivingProductsService } from '@nusantara/services';

@Component({
  selector: 'nus-marketplace-publish',
  template: `
    <h1 class="title-1" i18n>Publish To Marketplace</h1>
    <div class="wrapper">
      <div>
        <p class="body-2" i18n>Total Product</p>
        <p class="subheading-2"> {{ order?.totalProduct }} </p>
      </div>
      <div>
        <p class="body-2" i18n>Status</p>
        <p class="subheading-2"> {{ order?.receivingStatus }} </p>
      </div>
      <div>
        <p class="body-2" i18n>Warehouse</p>
        <p class="subheading-2 warehouse"> {{ order?.warehouse }} </p>
      </div>
      <div >
        <p class="body-2" i18n>Created By</p>
        <p class="subheading-2"> {{ order?.receivedBy ? order.receivedBy : '-' }} </p>
      </div>
      <div>
        <p class="body-2" i18n>Reviewed By</p>
        <p class="subheading-2"> {{ order?.approvedBy ? order.approvedBy : '-' }} </p>
      </div>
      <div>
        <p i18n>Date</p>
        <p class="subheading-2"> {{ order?.created | date: 'dd/MM/yyyy HH:mm:ss' }} </p>
      </div>
    </div>
    <div class="progress-info">
      <span class="subheading-1" i18n>
        Publishing Your Product ({{ order?.totalRecord?.published }}/{{order?.totalProduct}})
      </span>
      <a [routerLink]="[]" (click)="loadAllData()" i18n>Refresh All</a>
    </div>
    <div>
      <nus-tabs>
        <nus-tab [title]="'List Product'">
          <div *ngIf="order?.receivingStatus === err" class="error-info">
            <div>
              <h2 class="heading-2" i18n>There are Errors When Publishing Products</h2>
              <ul>
                <li i18n>Go to "Product Data Error" tab and click "Fix" on each product"</li>
                <li i18n>Go to "Credentials Error" tab, reconnect the stores, then click "Refresh"</li>
                <li i18n>
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
                <th i18n>Product (UPC)</th>
                <th i18n>SKU</th>
                <th class="numeric" i18n>Quantity</th>
                <th i18n>Store</th>
                <th i18n>Location</th>
                <th i18n>Status</th>
                <th i18n>Information</th>
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
                    'alert': product.status === 'Publishing' || product.status === 'In QC',
                    'error': product.status === err || product.status === 'QC Failed' }">
                    {{ product.status }}
                  </span>
                  <div class="cust-tooltip" *ngIf="product.status === err || product.status === 'QC Failed'">
                    <i id="transform" class="material-icons preview-icon">info</i>
                      <p class="tooltiptext triangle-border top" id="myDropdown">Error <br/> <span class="err-message">{{product.errorMessage}}</span></p>
                  </div>
                </td>
                <td>
                  <ng-template [ngIf]="product.errorStatus === 'error_authentication'" i18n>
                    Credentials Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'error_metadata'" i18n>
                    Product Data Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'error_timeout'" i18n>
                    Time Out Error
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'qc'" i18n>
                    QC
                  </ng-template>
                  <ng-template [ngIf]="product.errorStatus === 'qc_failed'" i18n>
                    QC Failed
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
        <nus-tab [title]="'QC (' + order?.totalRecord.qc + ')'">
          <!-- <div *ngIf="order?.totalRecord.qc > 0" class="error-info">
            <div>
              <h2 class="heading-2" i18n> {{ order?.totalRecord.pending }} Products in QC</h2>
              <p i18n>Please wait until QC finish</p>
            </div>
          </div> -->
          <nus-pagination-child
            *ngIf="qc?.entities?.length"
            [page]="qc"
            (fetchPageNumber)="fetchQC($event)"
          ></nus-pagination-child>
          <table>
            <thead>
              <tr>
                <th i18n>Product (UPC)</th>
                <th i18n>SKU</th>
                <th class="numeric" i18n>Quantity</th>
                <th i18n>Location</th>
                <th i18n>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of qc?.entities">
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
                    'alert': product.status === 'Publishing' || product.status === 'In QC',
                    'error': product.status === err || product.status === 'QC Failed' }">
                    {{ product.status }}
                  </span>
                  <div class="cust-tooltip" *ngIf="product.status === err || product.status === 'QC Failed'">
                    <i id="transform" class="material-icons preview-icon">info</i>
                      <p class="tooltiptext triangle-border top" id="myDropdown">Error <br/> <span class="err-message">{{product.errorMessage}}</span></p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <nus-pagination-child
            *ngIf="qc?.entities?.length"
            [page]="qc"
            (fetchPageNumber)="fetchQC($event)"
          ></nus-pagination-child>
        </nus-tab>
        <nus-tab [title]="'Credentials Error (' + order?.totalRecord.errorAuthentication + ')'">
          <div *ngIf="order?.totalRecord.errorAuthentication > 0" class="error-info">
            <div>
              <h2 class="heading-2" i18n>You are not Connected to Some Stores</h2>
              <p i18n>Click "Reconnect" on each stores to fix this.</p>
            </div>
            <div>
              <a [routerLink]="[]" (click)="fetchCredentialsError()" i18n>Refresh</a>
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
                <th i18n>Store</th>
                <th i18n>Marketplace</th>
                <th i18n>Status</th>
                <th class="centered" i18n>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let shop of credentialsError?.entities; let i = index">
                <td> {{ shop.name }} </td>
                <td>{{ shop.marketplace }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'success': shop.status === 'Published',
                    'alert': shop.status === 'Publishing' || shop.status === 'In QC',
                    'error': shop.status === err || shop.status === 'QC Failed' }">
                    {{ shop.status }}
                  </span>
                  <div class="cust-tooltip" *ngIf="shop.status === err || shop.status === 'QC Failed'">
                    <i id="transform" class="material-icons preview-icon">info</i>
                      <p class="tooltiptext triangle-border top" id="myDropdown" >Error <br/> <span class="err-message">{{shop.errorStatus}}</span></p>
                  </div>
                </td>
                <td class="centered">
                  <a [routerLink]="['/config', 'marketplace-integration', 'connect', shop.slug]" i18n>Reconnect</a>
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
              <h2 class="heading-2" i18n> {{ order?.totalRecord.errorMetadata }} Products Can't be Published</h2>
              <p i18n>Click "Fix" on each product below.</p>
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
                <th i18n>Product (UPC)</th>
                <th i18n>SKU</th>
                <th class="numeric" i18n>Quantity</th>
                <th i18n>Location</th>
                <th i18n>Status</th>
                <th class="centered" i18n>Action</th>
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
                    'alert': product.status === 'Publishing' || product.status === 'In QC',
                    'error': product.status === err || product.status === 'QC Failed' }">
                    {{ product.status }}
                  </span>
                  <div class="cust-tooltip" *ngIf="product.status === err || product.status === 'QC Failed'">
                    <i id="transform" class="material-icons preview-icon">info</i>
                      <p class="tooltiptext triangle-border top" id="myDropdown">Error <br/> <span class="err-message">{{product.errorMessage}}</span></p>
                  </div>
                </td>
                <td class="centered">
                  <a [routerLink]="['/catalog/products', product.slug]" i18n>Fix</a>
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
              <h2 class="heading-2" i18n>Unable to Publish to {{ order?.totalRecord.errorTimeout }} Marketplace</h2>
              <p i18n>Click "Refresh" on each product or click "Refresh All" to reupload all products.</p>
            </div>
            <div>
              <a [routerLink]="[]" (click)="refreshAllTimeoutError($event, receivingOrderId)" i18n>Refresh All</a>
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
                <th i18n>Product (UPC)</th>
                <th i18n>SKU</th>
                <th class="numeric" i18n>Quantity</th>
                <th i18n>Location</th>
                <th i18n>Status</th>
                <th class="centered" i18n>Action</th>
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
                    'alert': product.status === 'Publishing' || product.status === 'In QC',
                    'error': product.status === err || product.status === 'QC Failed' }">
                    {{ product.status }}
                  </span>
                  <div class="cust-tooltip" *ngIf="product.status === err || product.status === 'QC Failed'">
                    <i id="transform" class="material-icons preview-icon">info</i>
                      <p class="tooltiptext triangle-border top" id="myDropdown">Error <br/> <span class="err-message">{{product.errorMessage}}</span></p>
                  </div>
                </td>
                <td class="centered">
                  <a [routerLink]="[]" (click)="refreshTimeoutError($event, product.identifier)" i18n>Refresh</a>
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
    '.cust-tooltip { position: relative; display: inline-block; margin-left:26px; vertical-align:middle;}',
    '.no-button{background:transparent; border:none}',
    '.err-message{font-weight: normal; font-size: 14px;}',
    '.cust-tooltip .tooltiptext { visibility:hidden; width: 350px; background: #FFFFFF; color: black; box-shadow: 0px 5px 15px 0px rgb(0 0 0 / 20%); text-align: left; padding: 16px; position: absolute; z-index: 1; right: -47px; top: 25px; font-size:15pt; font-weight:bold}',
    '.cust-tooltip:hover .tooltiptext { visibility: visible;}',
    '.preview-icon{ background: black; color: white; border-radius: 50%;}',
    '.triangle-border.top:before {top: -20px;bottom: auto;left: auto;right: 45px;border-width: 0px 14px 20px;}',
    '.triangle-border.top:after { top: -13px; bottom: auto; left: auto; right: 47px; border-width: 0 13px 13px;}',
    '.triangle-border:after { content: ""; position: absolute; border-style: solid; border-color: #fff transparent; display: block; width: 0;}',
    '.triangle-border:before { content: ""; position: absolute; border-style: solid; border-color: #dfb7b736 transparent;; display: block; width: 0;}',
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
  order: marketplace.IReceivingOrderDetail;
  allProducts: PagedResponse<marketplace.IReceivingProduct>;
  credentialsError: PagedResponse<marketplace.IShopErrorDetail>;
  dataError: PagedResponse<marketplace.IReceivingProduct>;
  timeoutError: PagedResponse<marketplace.IReceivingProduct>;
  qc: PagedResponse<marketplace.IReceivingProduct>;
  isReady = true;
  err = 'Error';

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

  fetchQC(pageNumber?: number) {
    this.service
      .fetchProducts(pageNumber || 1, this.receivingOrderId, 'in-qc')
      .subscribe((page) => {
        this.qc = page;
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
    this.fetchQC()
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
