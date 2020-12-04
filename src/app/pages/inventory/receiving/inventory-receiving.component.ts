import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth';
import { DialogResult, ToastService, AbstractDetailComponent } from '../../../core';
import { inventory, ISubLocation, IWarehouse } from '../../../models';
import { InventoryReceivingService } from '../../../services';
import { IProduct } from '../../../models/products';
import { ProductSelectionModalComponent } from '../../../shared/product-selection-modal.component';

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-receiving',
  template: `
    <h1>Receiving Inventory Order</h1>

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
          <th>Warehouse</th>
          <td [formGroup]="warehouse">
            <select formControlName="href">
              <option [ngValue]="null">---</option>
              <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
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
            <th>Quantity</th>
            <th>SKU</th>
            <th>Batch</th>
            <th>Locator</th>
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
            <td colspan="9">
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
  styles: [`
    form { width: 1200px; max-width: 100%; }
    .inventory-order-meta {
      width: auto;
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
export class InventoryReceivingComponent extends AbstractDetailComponent<inventory.IReceivingOrder> implements OnInit, AfterViewInit {

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;
  currentDate: Date;

  constructor(private fb: FormBuilder,
              toast: ToastService,
              public authService: AuthService,
              service: InventoryReceivingService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get warehouse(): FormGroup { return this.form.get('warehouse') as FormGroup; }
  get stockRecords(): FormArray { return this.form.get('stockRecords') as FormArray; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[]}) => {
      this.warehouses = data.warehouses;
    });
    this.currentDate = new Date();
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.productSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
  }

  initializeForm(entity?: inventory.IReceivingOrder) {
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
    if (!!this.warehouses) {
      const wh = this.warehouses.filter(e => e.href === this.warehouse.get('href').value);
      if (wh.length > 0) {
        this.availableSubLocations = wh[0].subLocations;
        this.warehouse.disable();
      }
    }

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
        location:  this.fb.group({
          href: [null, Validators.required],
          // name: ['', ],
        }),
        sku: ['', [Validators.required, ]],
        originalQuantity: [1, [Validators.required, Validators.min(1), ]],
        batchNumber: ['', []],
        locator: this.fb.array([], [Validators.required, Validators.minLength(1)]),
        expiryDate: [null, []]
      });
      this.stockRecords.push(f);
    }
  }

  get userDisplayName(): string {
    return [
      this.authService.tokenPayload.last_name,
      this.authService.tokenPayload.first_name,
      `(${this.authService.tokenPayload.email})`,
    ].join(', ').trim();
  }

  getFormValue() {
    return this.form.getRawValue();
  }
}
