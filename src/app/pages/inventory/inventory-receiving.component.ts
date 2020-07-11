import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogResult, ToastService, AbstractDetailComponent } from '@nusantara/core';
import { IInventoryReceiving, ISubLocation, IWarehouse } from '@nusantara/models';
import { ProductSelectionModalComponent } from './product-selection-modal.component';
import { IProduct } from '@nusantara/models/products';

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-receiving',
  template: `
    <h1>Receive Inventory</h1>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span>Warehouse</span>
        <select [formControl]="warehouse">
          <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
            {{ wh.name }}
          </option>
        </select>
        <button (click)="confirmWarehouse()"
                type="button"
                [disabled]="warehouse.disabled || !warehouse.value"
                class="control">Confirm</button>
      </label>

      <div *ngIf="warehouse.disabled">
        <table>
          <thead>
          <tr>
            <th>Product</th>
            <th>Location</th>
            <th>Quantity</th>
            <th>SKU</th>
            <th>Batch</th>
            <th>Expiry Date</th>
            <th>Cost</th>
            <th></th>
          </tr>
          </thead>
          <tbody>

          <nus-inventory-receiving-line
            *ngFor="let rec of stockRecords.controls; let i=index"
            [form]="rec"
            [availableSubLocations]="availableSubLocations"
            (remove)="stockRecords.removeAt(i)">
          </nus-inventory-receiving-line>

          <tr>
            <td colspan="8">
              <button type="button" (click)="addLine()" class="add-button">
                Add Record
              </button>
            </td>
          </tr>

        </table>

        <nus-detail-actions
          [component]="this"
          (cancel)="navigateToParent(true)"
          (delete)="delete()">
        </nus-detail-actions>
      </div>
    </form>

    <!-- Modals -->
    <nus-product-selection-modal></nus-product-selection-modal>
  `,
  styles: [
    'form { width: 1200px; max-width: 100%; }',
  ]
})
export class InventoryReceivingComponent extends AbstractDetailComponent<IInventoryReceiving> implements OnInit, AfterViewInit {

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get warehouse(): FormControl { return this.form.get('warehouse') as FormControl; }
  get stockRecords(): FormArray { return this.form.get('stockRecords') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[]}) => {
      this.warehouses = data.warehouses;
    });
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  initializeForm(entity?: IInventoryReceiving) {
    this.form = this.fb.group({
      href: [],
      warehouse: [],
      status: ['pending', [Validators.required, ]],
      createdBy: [],
      approvedBy: [],
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

    const wh = this.warehouses.filter(e => e.href === this.warehouse.value)[0];
    this.availableSubLocations = wh.subLocations;

    this.warehouse.disable();
  }

  onProductSelectionModalClosed() {
    if (this.productSelectionModal.result === DialogResult.OK) {
      // add a new child to the form group based on the modal

      const selectedProduct = this.productSelectionModal.product.value as IProduct;

      // todo: see if the product class has an expiry date associated with it?
      // if so, we need to add a required validator to that field.
      // const expiryValidators = [];
      // if (selectedProduct.productClass)
      // disable digital products/subscription receiving.

      const f = this.fb.group({
        inventoryReceiving: [null, []],
        product: [selectedProduct, [Validators.required]],
        href: [null, []],
        subLocation: [null, [Validators.required]],
        sku: ['', [Validators.required, ]],
        quantity: [1, [Validators.required, Validators.min(1), ]],
        batchNumber: ['', []],
        expiryDate: ['', []]
      });
      this.stockRecords.push(f);
    }
  }
}
