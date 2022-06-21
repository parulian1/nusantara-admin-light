import { Component, OnInit } from '@angular/core';
import { AbstractDetailComponent, ErrorResult, getSlugFromHref, ToastService } from '@nusantara/core';
import { IAdjustmentReadOnly } from '@nusantara/models/inventory';
import { InventoryAdjustmentOrderService } from '@nusantara/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { IError } from '@nusantara/models';
import { AuthService } from '@nusantara/auth';


@Component({
  selector: 'nus-adjustment-detail',
  template: `
    <h1 class="title-1" i18n>
      Stock Adjustment {{entity.href|entityToSlug}}
    </h1>
    <p style="margin-bottom: 24px;" i18n>Edit shipping method for each product. Skip this step if you don't want to change anything.</p>

    <table id="general-table-info">
      <thead>
        <th i18n>Type</th>
        <th i18n>Status</th>
        <th i18n>Warehouse</th>
        <th i18n>Location</th>
        <th i18n>Created By</th>
        <th i18n>Reviewed By</th>
        <th i18n>Date</th>
      </thead>
      <tbody>
        <td>{{entity.type}}</td>
        <td>{{entity.status}}</td>
        <td>
          <a (click)="showWarehouseDetail()">{{entity.warehouse.name}}</a>
        </td>
        <td>{{ adjustmentLocationName }}</td>
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
            <th  class="product-name" i18n>Receiving ID / Product Name</th>
            <th class="product-sku" i18n>SKU</th>
            <th i18n>Receiving Date</th>
            <th i18n>Batch</th>
            <th i18n>Expiry Date</th>
            <th i18n>Stock</th>
            <th i18n>Different Qty</th>
            <th i18n>Adjusted Qty</th>
            <th i18n>Reason</th>
            <th i18n>Notes</th>
          </tr>
        </thead>
        <tbody>
        <tr *ngFor="let stock_record of entity.stockRecords">
          <td data-qa="product" class="product-name"
              title="{{ displayedName(stock_record.receivingOrder.href, stock_record.product.name, stock_record.location.href) }}">
            <div>
              {{ displayedName(stock_record.receivingOrder.href, stock_record.product.name, stock_record.location.href) }}
            </div>
          </td>
          <td data-qa="sku" class="product-sku" title="{{ stock_record.sku }}">
            <div>{{ stock_record.sku }}</div>
          </td>
          <td data-qa="created">
            {{ stock_record.created|date: 'dd MMM yyyy HH:mm' }}
          </td>
          <td data-qa="batch">
            {{ stock_record.batchNumber }}
          </td>
          <td data-qa="expiry">
            {{ stock_record.expiryDate|date: 'dd MMM yyyy HH:mm' }}
          </td>
          <td data-qa="actual-quantity">
            {{ stock_record.actualQuantity }}
          </td>
          <td data-qa="adjusted-quantity">
            {{ adjustedQty(stock_record.actualQuantity, stock_record.expectedQuantity) }}
          </td>
          <td data-qa="difference-quantity">
            {{ stock_record.expectedQuantity }}
          </td>
          <td data-qa="stock-reason">
            {{ stock_record.reason }}
          </td>
          <td data-qa="stock-notes">
            {{ stock_record.notes }} <!-- manual calculation ?? -->
          </td>
        </tr>
        </tbody>
      </table>
      <div class="detail-actions">
        <button type="button" (click)="approve()" [disabled]="isApproveDisabled" class="control" id="confirm-button" i18n>
          {{ approveButtonText }}
        </button>
        <button type="button" (click)="goBack()" class="control secondary" i18n>
          Back
        </button>
        <button type="button" (click)="reject()" [disabled]="isRejectDisabled" class="control danger ghost" i18n>
          {{ rejectButtonText}}
        </button>
      </div>
    </form>
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
    '#general-table-product td{height: 56px;width:8%;}',
    '#general-table-product td.product-name{width:15%;overflow: hidden;text-overflow: ellipsis;}',
    '#general-table-product td.product-sku{overflow: hidden;text-overflow: ellipsis;}',
    '#general-table-product td div{overflow: hidden;text-overflow: ellipsis;}',
    '#general-table-product thead{background-color: #F4F4F4;}',
    'table#general-table-product{}',
    'div.detail-actions { display: flex }',
    'button.danger { margin-left: auto }',
    '.product-name { width: 20%; }',
    '.product-sku { width: 10%; }',
  ]
})
export class AdjustmentDetailComponent  extends AbstractDetailComponent<IAdjustmentReadOnly> implements OnInit {
  entity: IAdjustmentReadOnly;
  approveButtonText: string = 'approve';
  rejectButtonText: string = 'reject';
  isApproveDisabled: boolean = false;
  isRejectDisabled: boolean = false;
  adjustmentLocationName = '-';

  constructor(public service: InventoryAdjustmentOrderService,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              public router: Router,
              public authService: AuthService,
              public toast: ToastService,
              public location: Location,
  ) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.entity.status !== 'pending' && !!this.entity?.reviewedBy) {
      this.isApproveDisabled = true;
      this.isRejectDisabled = true;
    }
  }

  initializeForm(entity: IAdjustmentReadOnly): void {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity.href, []],
      status: [entity?.status, []],
      reviewedBy: [entity?.reviewedBy, []],
    });
    this.getLocation();
  }

  showWarehouseDetail(): void {}

  approve(): void {
    if (!this.isApproveDisabled) {
      this.form.value.status = 'approved';
      this.save();
    }
  }

  reject(): void {
    if (!this.isRejectDisabled) {
      this.form.value.status = 'rejected';
      this.save();
    }
  }

  goBack(): void {
    this.router.navigate(['/inventory/orders-list']);
  }

  displayedName(receivingHref: string, productName: string, locationHref: string): string {
    return `${getSlugFromHref(receivingHref)} / ${productName} / ${getSlugFromHref(locationHref)}`;
  }

  adjustedQty(actualQty: number, expectedQty: number): number {
    return expectedQty - actualQty;
  }

  getFormValue(): any {
    return {
      ...super.getFormValue(),
      reviewedBy: {
        href: `https://${this.authService.tokenPayload?.site}/users/${this.authService.tokenPayload?.user_id}/`
      },
    };
  }

  save(): void {
    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe((resp) => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp.errorDetails);
        } else {
          this.isApproveDisabled = true;
          this.isRejectDisabled = true;
          if (this.form.value.status === 'approved') {
            this.approveButtonText = 'Please wait....';
          } else {
            this.rejectButtonText = 'Please wait....';
          }
          this.goBack();
        }
      }, (error) => {
        this.onSaveError(error.errorDetails);
      }, () => {
        this.goBack();
      }
    );
  }

  getLocation() {
    const stockRecords = this.entity.stockRecords;
    // Now, each stock adjustment can only be for 1 location and 1 warehouse.
    // So we can take the location from the first stock record
    this.adjustmentLocationName = stockRecords[0].location.name;
  }
}
