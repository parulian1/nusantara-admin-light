import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth';
import { DialogResult, ToastService, AbstractDetailComponent } from '@nusantara/core';
import { inventory, ISubLocation, IWarehouse, products } from '@nusantara/models';
import { InventoryTransferService } from '@nusantara/services';
import { ProductSelectionModalComponent } from '@nusantara/shared/product-selection-modal.component';
import { IProductClass } from '@nusantara/models/products';

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-transfer',
  template: `
    <h1 class="title-1" i18n>Transfer</h1>

    <form [formGroup]="form" (ngSubmit)="save()">

      <table class="inventory-order-meta">
        <tbody>
        <tr>
          <th i18n>Received By</th><td colspan="2">{{ userDisplayName }}</td>
        </tr>
        <tr>
          <th i18n>Approved By</th><td colspan="2">---</td>
        </tr>
        <tr>
          <th i18n>Receiving Date</th><td colspan="2">{{ currentDate|date }}</td>
        </tr>
        <tr>
          <th i18n>Status</th><td colspan="2" i18n>Pending</td>
        </tr>
        <tr>
          <th i18n>From Warehouse</th>
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
          <th i18n>Destination Warehouse</th>
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
                    class="control" i18n>Confirm</button>
          </td>
        </tr>
        </tbody>
      </table>

      <div *ngIf="warehouse.disabled">
        <table class="line-items">
          <thead>
          <tr>
            <th i18n>Product (UPC)</th>
            <th i18n>Location</th>
            <th i18n>Quantity</th>
            <th i18n>SKU</th>
            <th i18n>Batch</th>
            <th i18n>Locator</th>
            <th i18n>Expiry Date</th>
            <th i18n>Cost</th>
            <th></th>
          </tr>
          </thead>
          <tbody>

          <nus-inventory-transfer-line
            *ngFor="let rec of stockRecords.controls; let i=index"
            [productClasses]="productClasses"
            [availableSubLocations]="availableSubLocations"
            (remove)="stockRecords.removeAt(i)"
            [formGroup]="rec"
          >
          </nus-inventory-transfer-line>

          <tr>
            <td colspan="9">
              <button type="button" (click)="addLine()" class="add-button" i18n>
                Add Record
              </button>
            </td>
          </tr>

        </table>

        <nus-detail-actions
          [component]="this"
          (cancel)="resetForm(true)"
          (delete)="delete()">
        </nus-detail-actions>
      </div>
    </form>

    <!-- Modals -->
    <nus-product-selection-modal [productType]="productType"></nus-product-selection-modal>
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

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  productClasses: IProductClass[] = [];
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  currentDate: Date;
  destinationWarehouses: IWarehouse[];
  productType: string = 'single';

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

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[], productClasses: IProductClass[]}) => {
      this.productClasses = data.productClasses;
      this.warehouses = data.warehouses;
    });
    this.currentDate = new Date();
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  initializeForm(entity?: inventory.ITransferOrder) {
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
    this.productSelectionModal.open();
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
        sku: ['', [Validators.required, ]],
        originalQuantity: [1, [Validators.required, Validators.min(1), ]],
        batchNumber: ['', []],
        locator: this.fb.array([], [Validators.minLength(1)]),
        expiryDate: [null, [Validators.required,]]
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

  save(): void {
    super.save();
    this.stockRecords.clear();
  }

  resetForm(warnOnDirty = false) {
    if (warnOnDirty && this.form?.dirty) {
      const leavePage = confirm('Your changes will be lost.  Do you want to continue?');
      if (!leavePage) {
        return;
      } else {
        window.location.reload();
      }
    }
    this.form.reset();
    this.warehouse.enable();
    this.stockRecords.clear();
  }
}
