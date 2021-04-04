import { Component, OnInit } from '@angular/core';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IAdjustment, IReceivingOrder } from '@nusantara/models/inventory';
import { InventoryReceivingOrderService } from '@nusantara/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'nus-adjustment-detail',
  template: `
    <h1></h1>

    <h1 class="title-1">
      Stock Adjustment {{entity.href|entityToSlug}}
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

      <td *ngIf="!entity.createdBy?.username">-</td>
      <td *ngIf="entity.createdBy?.username">{{entity.createdBy?.username}}</td>

      <td *ngIf="!entity.reviewedBy?.username">-</td>
      <td *ngIf="entity.reviewedBy?.username">{{entity.reviewedBy?.username}}</td>

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
          <th>Receiving Date</th>
          <th>Available Stock in Product Record</th>
          <th>Adjusted Qty</th>
          <th>Difference Qty</th>
          <th>Reason</th>
          <th>Notes</th>
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
            {{ stock_record.expiryDate|date: 'dd MMM yyyy HH:mm' }}
          </td>
          <td data-qa="original-quantity">
            {{ stock_record.originalQuantity }} <!-- is it current quantity ?? -->
          </td>
          <td data-qa="stock-original">
            {{ stock_record.originalQuantity }}
          </td>
          <td data-qa="stock-requested">
            {{ stock_record.requestingStock }} <!-- manual calculation ?? -->
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
export class AdjustmentDetailComponent  extends AbstractDetailComponent<IAdjustment> implements OnInit {
  entity: IAdjustment;

  constructor(public service: InventoryReceivingOrderService,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              public router: Router,
              public toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  initializeForm(entity: IReceivingOrder): void {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity.href, []],
      status: [entity?.status, []],
    });
  }

  showWarehouseDetail(): void {}

  approve(): void { alert('approve'); }
  cancel(): void { alert('cancel'); }
  reject(): void { alert('reject'); }
}
