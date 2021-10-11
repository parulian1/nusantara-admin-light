import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth';
import { DialogResult, ToastService, AbstractDetailComponent, ErrorResult } from '@nusantara/core';
import { IHttpFailure, inventory, ISubLocation, IWarehouse, products } from '@nusantara/models';
import { InventoryTransferService } from '@nusantara/services';
import { ProductSelectionModalComponent } from '@nusantara/shared/product-selection-modal.component';
import { IProductClass } from '@nusantara/models/products';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ConfirmModalInvetoryOrderComponent } from '@nusantara/shared';

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-transfer',
  template: `
    <h1 class="title-1">Transfer Inventory Order</h1>

    <form [formGroup]="form" (ngSubmit)="save()">

      <table class="inventory-order-meta">
        <tbody>
        <tr>
          <th>Received By</th><td colspan="2">{{ userDisplayName }}</td>
        </tr>
        <tr>
          <th>Approved By</th><td colspan="2">---</td>
        </tr>
        <tr>
          <th>Receiving Date</th><td colspan="2">{{ currentDate|date }}</td>
        </tr>
        <tr>
          <th>Status</th><td colspan="2">Pending</td>
        </tr>
        <tr>
          <th>From Warehouse</th>
          <td [formGroup]="warehouse">
            <select formControlName="href" (change)="updateDestinationWarehouses($event)" data-qa="from-warehouse">
              <option [ngValue]="null">---</option>
              <option *ngFor="let wh of warehouses" [value]="wh.href">
                {{ wh.name }}
              </option>
            </select>
          </td>
          <td>
        </tr>
        <tr>
          <th>Destination Warehouse</th>
          <td [formGroup]="destinationWarehouse">
            <select formControlName="href" data-qa="destination-warehouse">
              <option [ngValue]="null">---</option>
              <option *ngFor="let wh of destinationWarehouses" [value]="wh.href">
                {{ wh.name }}
              </option>
            </select>
          </td>
          <td>
            <button (click)="confirmWarehouse()"
                    type="button"
                    [disabled]="warehouse.disabled || !warehouse.valid"
                    class="control">Confirm</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div *ngIf="warehouse.disabled">
        <table class="line-items">
          <thead>
          <tr>
            <th>Product (UPC)</th>
            <th>Location</th>
            <th>Current Stock</th>
            <th>Requesting Stock</th>
            <th>Cost</th>
            <th></th>
          </tr>
          </thead>
          <tbody>

          <nus-transfer-order-line
            *ngFor="let rec of stockRecords.controls; let i=index"
            [productClasses]="productClasses"
            [availableSubLocations]="availableSubLocations"
            [warehouseHref]="getFromWarehouseHref()"
            (remove)="stockRecords.removeAt(i)"
            [formGroup]="rec"
          >
          </nus-transfer-order-line>

          <tr>
            <td colspan="9">
              <button type="button" (click)="addLine()" class="add-button">
                Add Record
              </button>
            </td>
          </tr>

        </table>

        <nus-detail-actions
          [component]="this"
          (cancel)="confirmModal()"
          (delete)="delete()">
        </nus-detail-actions>
      </div>
    </form>

    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>
    <nus-confirm-inventory-modal [cancelWithoutReload]="true"></nus-confirm-inventory-modal>
  `,
  styles: [`
    form { width: 58vw; max-width: 100%; }
    .inventory-order-meta {
      width: 100%;
    }
    .inventory-order-meta th {
      text-align: left;
    }
    .line-items {
      margin-top: 25px;
    }
  `
  ]
})
export class InventoryTransferOrderComponent extends AbstractDetailComponent<inventory.ITransferOrder> implements OnInit, AfterViewInit {

  form: FormGroup;
  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  productClasses: IProductClass[] = [];
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  @ViewChild(ConfirmModalInvetoryOrderComponent) confirmModalReceiving: ConfirmModalInvetoryOrderComponent;
  currentDate: Date;
  destinationWarehouses: IWarehouse[];

  constructor(private fb: FormBuilder,
              toast: ToastService,
              public authService: AuthService,
              service: InventoryTransferService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get warehouse(): FormGroup { return this.form.get('warehouse') as FormGroup; }
  get destinationWarehouse(): FormGroup { return this.form.get('destinationWarehouse') as FormGroup; }
  get stockRecords(): FormArray { return this.form.get('stockRecords') as FormArray; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[], productClasses: IProductClass[]}) => {
      this.productClasses = data.productClasses;
      this.warehouses = data.warehouses;
    });
    this.currentDate = new Date();
  }

  ngAfterViewInit(): void {
    // wire-up modal closed callback
    super.ngAfterViewInit();
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.confirmModalReceiving.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  initializeForm(entity?: inventory.ITransferOrder): void {
    // TODO: replace this! maybe embed href identity in token claims?
    this.form = this.fb.group({
      href: [],
      warehouse: this.fb.group({
        href: [null, Validators.required],
        // name: ['', ],
      }),
      status: ['pending', [Validators.required, ]],
      createdBy: this.fb.group({
        href: `https://bhisma.cloud/api/iam/${this.authService.tokenPayload.user_id}/`
      }),
      reviewedBy: [null, ],
      destinationWarehouse: this.fb.group({
        href: [null, Validators.required],
        // name: ['', ],
      }),
      stockRecords: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    });
  }

  addLine() {
    this.form.updateValueAndValidity();
    this.productSelectionModal.openWithStockAmount();
    console.log('form valid', this.form.valid, this.form);
  }

  confirmWarehouse(): void {
    if (!this.warehouse.value) {
      alert('You must first select a warehouse');
      return;
    }

    if (!this.destinationWarehouse.value) {
      alert('You must first select a destination warehouse');
      return;
    }

    const wh = this.warehouses.filter(e => e.href === this.warehouse.get('href').value)[0];
    if (wh) {
      this.availableSubLocations = wh.subLocations;
      this.warehouse.disable();
    }
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      // add a new child to the form group based on the modal

      const selectedProduct = this.productSelectionModal.product.value as products.IProduct;

      // todo: see if the product class has an expiry date associated with it?
      // if so, we need to add a required validator to that field.
      // const expiryValidators = [];
      // if (selectedProduct.productClass)
      // disable digital products/subscription receiving.

      const f = this.fb.group({
        inventoryReceiving: [null, []],
        product: [selectedProduct, [Validators.required]],
        href: [null, []],
        location:  this.fb.group({
          href: [null, Validators.required],
          // name: ['', ],
        }),
        originalQuantity: [1, [Validators.required, Validators.min(1), ]],
        cost: [{value: 0, disabled: true}, [Validators.required, Validators.min(0)]]
      });
      this.stockRecords.push(f);
    }
  }

  updateDestinationWarehouses(event) {
    this.destinationWarehouses = this.warehouses.filter((warehouse) => {
      return warehouse.href.indexOf(event.target.value) === -1;
    });
  }

  get userDisplayName(): string {
    return [
      this.authService.tokenPayload?.last_name ?? '',
      this.authService.tokenPayload?.first_name ?? '',
      `(${this.authService.tokenPayload?.email ?? ''})`,
    ].join(', ').trim();
  }

  getFormValue() {
    return this.form.getRawValue();
  }

  save(headers?: any): void {
    this.service.save(this.getFormValue(), headers).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IHttpFailure>(err.error, err.status));
      } else {
        return of(new ErrorResult<IHttpFailure>({detail: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(
      resp => {
        if (resp.success) {
          this.onSaveSuccess(resp);
          this.stockRecords.clear();
        } else {
          this.onSaveError(resp);
        }
      }
    );
  }

  getFromWarehouseHref(): string {
    const warehouse: IWarehouse = this.warehouse.value;
    return warehouse?.href;
  }

  confirmModal() {
    this.confirmModalReceiving.open();
  }

  onConfirmModalClosed() {
    if (this.confirmModalReceiving.result === DialogResult.OK) {
      this.resetForm();
    }
  }

  resetForm() {
    this.form.reset();
    this.warehouse.enable();
    this.destinationWarehouse.enable();
    this.stockRecords.clear();
    this.initializeForm();
  }
}
