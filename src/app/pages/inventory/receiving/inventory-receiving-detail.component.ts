import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import {
  IWarehouse,
  IWarehouseDetail,
  IWarehouseInformation,
  IError
} from '@nusantara/models';
import { IReceivingOrder } from '@nusantara/models/inventory';
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


@Component({
  selector: 'nus-receiving-order-detail',
  template: `
    <h1 class="title-1">
      Pending Order {{entity.href|entityToSlug}}
    </h1>
    <p style="margin-bottom: 24px;">Edit shipping method for each product. Skip this step if you don't want to change anything.</p>
    <table id="general-table-info">
      <thead>
            <th>Type</th>
            <th>Status</th>
            <th>Warehouse</th>
            <th>Created By</th>
            <th>Reviewed By</th>
            <th>Date</th>
      </thead>
      <tbody>
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
      <table id="general-table-product">
        <thead>
        <tr>
          <th>
              Product
          </th>
          <th>Location</th>
          <th>sku</th>
          <th>Locator</th>
          <th>Original Quantity</th>
          <th>Stock Requested</th>
          <th>Batch Number</th>
          <th>Expiry Date</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let stock_record of entity.stockRecords">
          <td data-qa="product">
            <div>{{ stock_record.product.name }}</div>
          </td>
          <td>
            <div>{{ stock_record.location.name }}</div>
          </td>
          <td>
            <div>{{ stock_record.sku }}</div>
          </td>
          <td>
            {{ stock_record.locator }}
          </td>
          <td data-qa="original-quantity">
            {{ stock_record.originalQuantity }}
          </td>
          <td data-qa="stock-requested">
            {{ stock_record.requestingStock }}
          </td>
          <td>
            {{ stock_record.batchNumber }}
          </td>
          <td>
            {{ stock_record.expiryDate|date: 'dd MMM yyyy HH:mm' }}
          </td>
        </tr>
        </tbody>
      </table>
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
    '#general-table-info, #general-table-product{margin-bottom: 30px;height: 80px;border-radius: 8px}',
    'a{background:none;border:none;cursor: pointer;font-weight: 700;}',
    '#general-table-info th{text-align: left;font-weight: 400;}',
    '#general-table-info td{text-align: left;font-weight: 700;color: #5A5A5A;}',
    '#general-table-product th{font-weight: 700;color: #5A5A5A;}',
    '#general-table-product td{height: 56px}',
    '#general-table-product td div{white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}',
    '#general-table-product thead{background-color: #F4F4F4;}',
    'table#general-table-product{table-layout: fixed;}',
    'div.detail-actions { display: flex }',
    'button.danger { margin-left: auto }'
  ]
})
export class InventoryReceivingDetailComponent extends AbstractDetailComponent<IReceivingOrder> implements OnInit {
  entity: IReceivingOrder;
  warehouses: IWarehouse[];
  warehouseDetail: IWarehouseDetail[];
  marketplaceValue = 0;

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
    this.clientService.getWarehouseInformation(this.entity.warehouse.code).subscribe(
        (data: IWarehouseInformation) => {
          this.warehouseDetail = data.details;
          this.marketplaceValue = data.totalMarketplace;
        }
      );
  }

  initializeForm(entity: IReceivingOrder) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity.href, []],
      status: [entity?.status, []],
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
}
