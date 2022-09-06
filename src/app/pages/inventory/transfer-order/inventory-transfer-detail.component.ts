import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  IWarehouse,
  marketplace,
  IError, ISubLocation
} from '@nusantara/models';
import {IReceivingOrder, IStockRecord, ITransferOrder} from '@nusantara/models/inventory';
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
import { IProduct, IProductClass } from '@nusantara/models/products';


@Component({
  selector: 'nus-transfer-order-detail',
  template: `
    <h1 class="title-1" i18n>
      Inventory Order #{{entity.href|entityToSlug}}
    </h1>
    <p style="margin-bottom: 24px;" i18n>Edit shipping method for each product. Skip this step if you don't want to change anything.</p>
    <table id="general-table-info">
      <thead>
        <th i18n>Created Date</th>
        <th i18n>Source Warehouse</th>
        <th i18n>Created By</th>
        <th i18n>Destination Warehouse</th>
        <th i18n>Received By</th>
        <th i18n>Status</th>
      </thead>
      <tbody>
        <td>
          <span>{{ entity.created | date: 'dd/MM/yyyy HH:mm:ss' }}</span>
        </td>
        <td>
          <span>{{ entity.warehouse.name }}</span>
        </td>
        <td>{{ entity.createdBy?.name ?? '-' }}</td>
        <td>{{ entity.destinationWarehouse.name }} </td>
        <td>
          {{ entity.reviewedBy?.name }}
        </td>
        <td>{{ entity.status }}</td>
      </tbody>
    </table>
    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <table class="general-table-product">
        <thead>
          <tr>
            <th i18n>Product (UPC) / Sender Location</th>
            <th i18n>SKU</th>
            <th i18n>Batch</th>
            <th i18n>Expiry Date</th>
            <th i18n>Transfer Quantity</th>
            <th i18n>Destination Location</th>
            <th i18n>Destination Locator(Optional)</th>
          </tr>
        </thead>
        <tbody>
          <nus-inventory-transfer-detail-item
            *ngFor="let rec of stockRecords.controls; let i=index"
            [form]="rec"
            [availableSubLocations]="availableSubLocations"
            [status]="entity.status">
          </nus-inventory-transfer-detail-item>
        </tbody>
      </table>
      <div>
        <label>
          <span i18n>Notes (Optional)</span>
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
        <button type="button" (click)="approve()" [disabled]="!!isDisabled" class="control" id="confirm-button"  i18n>
          Approve
        </button>
        <button type="button" (click)="cancel()" class="control secondary"  i18n>
          Back
        </button>
        <button type="button" (click)="reject()" [disabled]="!!isDisabled" class="control danger ghost"  i18n>
          Reject
        </button>
      </div>
    </form>
  `,
  styles: [
    'button:not(:first-child) { margin-left: 5px; }',
    'form{max-width: none;}',
    '#general-table-info, .general-table-product{margin-bottom: 30px;height: 80px;border-radius: 8px; border-collapse: collapse;}',
    'a{background:none;border:none;cursor: pointer;font-weight: 700;}',
    '#general-table-info th{text-align: left;font-weight: 400;}',
    '#general-table-info td{text-align: left;font-weight: 700;color: #5A5A5A;}',
    '.general-table-product th{font-weight: 700;color: #5A5A5A;}',
    '.general-table-product td{height: 56px;width:8%}',
    '.general-table-product td.product-name{width: 30%}',
    '.general-table-product td div{white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}',
    '.general-table-product thead{background-color: #F4F4F4;}',
    'table.general-table-product{table-layout: auto;}',
    'div.detail-actions { display: flex }',
    'button.danger { margin-left: auto }',
  ]
})
export class InventoryTransferDetailComponent extends AbstractDetailComponent<IReceivingOrder> implements OnInit {
  entity: ITransferOrder;
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
    this.route.data.subscribe((data: { warehouses: IWarehouse[], productClasses: IProductClass[] }) => {
      this.warehouses = data.warehouses;
      this.productClasses = data.productClasses;
      const wh = this.warehouses?.find(e => e.href === this.entity.destinationWarehouse.href);
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

  initializeForm(entity: ITransferOrder) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity.href, []],
      stockRecords: this.fb.array([], []),
      status: [entity?.status, []],
      notes: [entity?.notes, [Validators.maxLength(160)]]
    });
  }

  approve() {
    this.form.value.status = 'approved';

    const stockRecords = this.form.value.stockRecords;

    let errorLocation = 0;
    stockRecords.forEach((stock) => {
      if (stock.location.href === null) {
        errorLocation += 1;
      }
    });

    if (errorLocation > 0) {
      this.toast?.addError('Location is required. Please check your input again.', 'Failed to Save');
      return;
    }

    this.save();
  }

  reject() {
    this.form.value.status = 'rejected';
    const stockRecordsForm = this.form.get('stockRecords') as FormArray;
    // Stock record location is not required if receiving order rejected
    stockRecordsForm.controls.forEach((item) => {
      const location = item.get('location');
      location.get('href').setValidators([]);
      location.value.href = null;
    });
    this.save();
  }

  save() {
    if (!!this.form.valid) {
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
      selectedSubLocations = item.location;
    } else {
      selectedSubLocations = null;
    }

    const stockRecord = this.fb.group({
      inventoryReceiving: [null, []],
      product: [product, [Validators.required]],
      href: [item.href, []],
      location: this.fb.group({
        href: [selectedSubLocations, [Validators.required]],
        name: [selectedSubLocations?.name, []]
      }),
      sku: [item.sku, []],
      originalQuantity: [item.originalQuantity, [Validators.required, Validators.min(1)]],
      batchNumber: [item.batchNumber, []],
      locator: this.fb.array([]),
      expiryDate: [item.expiryDate, []],
      cost: [item.cost, []],
      requestingStock: [item.requestingStock, []],
      receivingLocation: this.fb.group({
        href: [item.receivingLocation?.href, [Validators.required]],
        name: [item.receivingLocation?.name, []]
      })
    });
    item.locator.forEach( (data) => {
      const locator = stockRecord.get('locator') as FormArray;
      locator.push(new FormControl(data, []));
    });
    this.stockRecords.push(stockRecord);
  }

  get isDisabled(): boolean {
    if (this.entity.status !== 'pending') {
      return true;
    }
    if (!this.form.valid) {
      return true;
    }
    return false
  }
}
