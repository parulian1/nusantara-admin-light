import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {
  IWarehouse,
  marketplace,
  IError, ISubLocation
} from '@nusantara/models';
import {IReceivingOrder, IStockRecord} from '@nusantara/models/inventory';
import { AbstractDetailComponent } from '@nusantara/core/components';
import {
  InventoryReceivingOrderService,
  MarketplaceClientService
} from '@nusantara/services';
import { ToastService, ErrorResult } from '@nusantara/core';
import {
  MarketplaceChannelInfoModalComponent,
  ConfirmModalPendingOrderComponent,
} from '@nusantara/shared';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {IProduct, IProductClass} from '@nusantara/models/products';


@Component({
  selector: 'nus-receiving-order-detail',
  template: `
    <h1 class="title-1">
      Pending Order {{entity.href|entityToSlug}}
    </h1>
    <p style="margin-bottom: 24px;">Edit shipping method for each product. Skip this step if you don't want to change anything.</p>
    <table id="general-table-info">
      <thead>
        <th>DO Number</th>
        <th>PIC Sender</th>
        <th>Type</th>
        <th>Status</th>
        <th>Warehouse</th>
        <th>Created By</th>
        <th>Reviewed By</th>
        <th>Date</th>
      </thead>
      <tbody>
        <td>
          <span *ngIf="!entity.doNumber">-</span>
          <span>{{entity.doNumber}}</span>
        </td>
        <td>
          <span *ngIf="!entity.dcPic">-</span>
          <span>{{entity.dcPic}}</span>
        </td>
        <td>{{entity.type}}</td>
        <td>{{entity.status}}</td>
        <td>
          <a (click)="showWarehouseDetail()">{{entity.warehouse.name}}</a>
        </td>

        <td *ngIf="!entity.createdBy?.name">-</td>
        <td *ngIf="entity.createdBy?.name">{{entity.createdBy?.name}}</td>

        <td *ngIf="!entity.reviewedBy?.name">-</td>
        <td *ngIf="entity.reviewedBy?.name">{{entity.reviewedBy?.name}}</td>

        <td>{{entity.created | date: 'dd/MM/yyyy HH:mm:ss'}}</td>
      </tbody>
    </table>
    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <table *ngIf="entity.status !== 'pending'" class="general-table-product">
        <thead>
        <tr>
          <th>
              Product
          </th>
          <th>SKU</th>
          <th>Original Quantity</th>
          <th>Stock Requested</th>
          <th>Batch Number</th>
          <th>Expiry Date</th>
          <th>Cost</th>
          <th>Location</th>
          <th>Locator</th>
        </tr>
        </thead>
        <tbody>
          <tr *ngFor="let stockRecord of entity.stockRecords">
            <td data-qa="product">
              <div>{{ stockRecord.product.name }}</div>
            </td>
            <td>
              <div>{{ stockRecord.sku }}</div>
            </td>
            <td data-qa="original-quantity">
              {{ stockRecord.originalQuantity }}
            </td>
            <td data-qa="stock-requested">
              {{ stockRecord.requestingStock }}
            </td>
            <td>
              <ng-container *ngIf="!stockRecord.batchNumber"> - </ng-container>
              <ng-container *ngIf="stockRecord.batchNumber">{{ stockRecord.batchNumber }}</ng-container>
            </td>
            <td>
              <ng-container *ngIf="!stockRecord.expiryDate"> - </ng-container>
              <ng-container *ngIf="stockRecord.expiryDate">{{ stockRecord.expiryDate|date: 'dd MMM yyyy HH:mm' }}</ng-container>
            </td>
            <td>
              <ng-container *ngIf="!stockRecord.cost"> - </ng-container>
              <ng-container *ngIf="stockRecord.cost">{{ stockRecord.cost | currency:'IDR':'symbol-narrow':'1.0' }}</ng-container>
            </td>
            <td>
              <ng-container *ngIf="!stockRecord.location"> - </ng-container>
              <ng-container *ngIf="!!stockRecord.location">{{ stockRecord.location?.name }}</ng-container>
            </td>
            <td>
              <ng-container *ngIf="!stockRecord.locator"> - </ng-container>
              <ng-container *ngIf="stockRecord.locator">{{ stockRecord.locator }}</ng-container>
            </td>
          </tr>
        </tbody>
      </table>
      <table *ngIf="entity.status === 'pending'" class="general-table-product">
        <thead>
          <tr>
            <th>Product (UPC)</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Batch</th>
            <th>Expiry Date</th>
            <th>Cost</th>
            <th>Location</th>
            <th>Locator</th>
          </tr>
        </thead>
        <tbody>
          <nus-inventory-receiving-detail-item
            *ngFor="let rec of stockRecords.controls; let i=index"
            [form]="rec"
            [availableSubLocations]="availableSubLocations">
          </nus-inventory-receiving-detail-item>
        </tbody>
      </table>
      <div>
        <label>
          <span>Notes (Optional)</span>
          <ng-container *ngIf="entity.status === 'pending'">
            <input type="text" [formControl]="notes" placeholder="Input Notes">
            <nus-field-errors [control]="notes"></nus-field-errors>
          </ng-container>
          <ng-container *ngIf="entity.status !== 'pending'">
            <p *ngIf="entity.notes">{{entity.notes}}</p>
            <p *ngIf="!entity.notes"> - </p>
          </ng-container>
        </label>
      </div>
      <div class="detail-actions">
        <button type="button" (click)="approve()" [disabled]="entity.status !== 'pending'" class="control" id="confirm-button">
          Approve
        </button>
        <button type="button" (click)="cancel()" class="control secondary">
          Back
        </button>
        <button type="button" (click)="reject()" [disabled]="entity.status !== 'pending'" class="control danger ghost">
          Reject
        </button>
      </div>
    </form>
    <nus-marketplace-channel-info-modal [warehouseInfoDetail]="warehouseDetail"></nus-marketplace-channel-info-modal>
    <nus-confirm-pending-modal></nus-confirm-pending-modal>
  `,
  styles: [
    'button:not(:first-child) { margin-left: 5px; }',
    'form{max-width: none;}',
    '#general-table-info, .general-table-product{margin-bottom: 30px;height: 80px;border-radius: 8px}',
    'a{background:none;border:none;cursor: pointer;font-weight: 700;}',
    '#general-table-info th{text-align: left;font-weight: 400;}',
    '#general-table-info td{text-align: left;font-weight: 700;color: #5A5A5A;}',
    '.general-table-product th{font-weight: 700;color: #5A5A5A;}',
    '.general-table-product td{height: 56px}',
    '.general-table-product td div{white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}',
    '.general-table-product thead{background-color: #F4F4F4;}',
    'table.general-table-product{table-layout: fixed;}',
    'div.detail-actions { display: flex }',
    'button.danger { margin-left: auto }'
  ]
})
export class InventoryReceivingDetailComponent extends AbstractDetailComponent<IReceivingOrder> implements OnInit {
  entity: IReceivingOrder;
  warehouses: IWarehouse[];
  warehouseDetail: marketplace.IWarehouseDetail[];
  marketplaceValue = 0;
  availableSubLocations: ISubLocation[] = [];
  productClasses: IProductClass[] = [];

  @ViewChild(MarketplaceChannelInfoModalComponent) marketplaceChannelInfo: MarketplaceChannelInfoModalComponent;
  @ViewChild(ConfirmModalPendingOrderComponent) marketplaceProgressModal: ConfirmModalPendingOrderComponent;

  constructor(public service: InventoryReceivingOrderService,
              public route: ActivatedRoute,
              private location: Location,
              public router: Router,
              public clientService: MarketplaceClientService,
              private fb: FormBuilder,
              public toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
    if (!!this.entity.warehouse.code) {
      this.clientService.getWarehouseInformation(this.entity.warehouse.code).subscribe(
        (data: marketplace.IWarehouseInfo) => {
          this.warehouseDetail = data.details;
          this.marketplaceValue = data.totalMarketplace;
        }
      );
    }
    this.route.data.subscribe((data: { warehouses: IWarehouse[], productClasses: IProductClass[] }) => {
      this.warehouses = data.warehouses;
      this.productClasses = data.productClasses;
      const wh = this.warehouses?.find(e => e.href === this.entity.warehouse.href);
      if (wh) {
        this.availableSubLocations = wh.subLocations;
      }
    });
    this.entity.stockRecords.forEach( (lineItem: IStockRecord) => {
      this.receivingItem(lineItem);
    });
  }

  get stockRecords(): FormArray {
    return this.form.get('stockRecords') as FormArray;
  }

  get notes(): FormControl {
    return this.form.get('notes') as FormControl;
  }

  initializeForm(entity: IReceivingOrder) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity.href, []],
      stockRecords: this.fb.array([], []),
      status: [entity?.status, []],
      notes: [entity?.notes, []]
    });
  }

  approve() {
    this.form.value.status = 'approved';
    this.save();
  }

  reject() {
    this.form.value.status = 'rejected';
    this.save();
  }

  save() {
    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(
      resp => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp.errorDetails);
        } else {
          if (this.getFormValue().status !== 'rejected'){
            if (this.marketplaceValue !== 0){
                this.marketplaceProgressModal.open();
            } else {
              this.location.back();
            }
          } else {
            this.location.back();
          }
        }
      }
    );
  }

  showWarehouseDetail() {
    this.marketplaceChannelInfo.open();
  }

  showMarketplaceProgressModal() {
    this.marketplaceProgressModal.open();
  }
  cancel() {
    this.location.back();
  }

  receivingItem(entity: IStockRecord) {
    const item = entity;
    const product = item.product as IProduct;

    let selectedSubLocations;
    if (item.location !== null) {
      selectedSubLocations = item.location.href;
    } else {
      selectedSubLocations = null;
    }

    const stockRecord = this.fb.group({
      inventoryReceiving: [null, []],
      product: [product, [Validators.required]],
      href: [item.href, []],
      location: this.fb.group({
        href: [selectedSubLocations, [Validators.required]],
      }),
      sku: [item.sku, []],
      originalQuantity: [item.originalQuantity, [Validators.required, Validators.min(1)]],
      batchNumber: [item.batchNumber, []],
      locator: this.fb.array([]),
      expiryDate: [item.expiryDate, []],
      cost: [item.cost, []]
    });
    item.locator.forEach( (data) => {
      const locator = stockRecord.get('locator') as FormArray;
      locator.push(new FormControl(data, []));
    });
    this.stockRecords.push(stockRecord);
  }
}
