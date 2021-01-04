import { Component, OnInit } from "@angular/core";

import { AbstractDetailComponent } from "@nusantara/core/components";
import { IReceivingOrder } from "@nusantara/models/inventory";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { InventoryReceivingOrderService } from "@nusantara/services";
import { ToastService } from '@nusantara/core';


@Component({
  selector: 'nus-receiving-order-detail',
  template: `
    <h1>
      <i>Pending Order {{entity.href|entityToSlug}}</i>
    </h1>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span>Type</span>
        <input type="text" [value]="entity.type" readonly>
      </label>

      <label>
        <span>
          Status
        </span>
        <input type="text" [value]="entity.status" readonly>
      </label>

    <label>
        <span>
          Warehouse
        </span>
      <input type="text" [value]="entity.warehouse.name" readonly>
    </label>

    <label>
        <span>
          Created By
        </span>
      <input type="text" [value]="entity.createdBy?.name" readonly>
    </label>

    <label>
        <span>
          Reviewed By
        </span>
      <input type="text" [value]="entity.reviewedBy?.name" readonly>
    </label>

    <label>
        <span>
          Created
        </span>
      <input type="text" [value]="entity.created|date: 'dd MMM yyyy HH:mm'" readonly>
    </label>

    <table>
      <thead>
      <tr>
        <th>
            Product
        </th>
        <th>Location</th>
        <th>sku</th>
        <th>Locator</th>
        <th>Original Quantity</th>
        <th>Batch Number</th>
        <th>Expiry Date</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let stock_record of entity.stockRecords">
        <td data-qa="product">
          {{ stock_record.product.name }}
        </td>
        <td>
          {{ stock_record.location.name }}
        </td>
        <td>
          {{ stock_record.sku }}
        </td>
        <td>
          {{ stock_record.locator }}
        </td>
        <td data-qa="original-quantity">
          {{ stock_record.originalQuantity }}
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
    <button type="button" (click)="approve()" [disabled]="entity.status !== 'pending'" class="control">
      Approve
    </button>
    <button type="button" (click)="navigateToParent(true)" class="control secondary">
      Cancel
    </button>
    <button type="button" (click)="reject()" [disabled]="entity.status !== 'pending'" class="control danger">
      Reject
    </button>
  </form>
  `,
  styles: [
    // ':host { display: flex; margin-top: 1.5em; }',
    // ':not(:first-child) { margin-left: 5px; }',
    'button.danger { margin-left: auto }',
    'button { min-width: 105px; }'
  ]
})
export class InventoryReceivingDetailComponent extends AbstractDetailComponent<IReceivingOrder> implements OnInit {
  entity: IReceivingOrder;

  constructor(service: InventoryReceivingOrderService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
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
    super.save();
  }

}
