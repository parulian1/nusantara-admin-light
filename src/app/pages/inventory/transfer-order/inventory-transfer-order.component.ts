import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../auth';
import {
  DialogResult,
  ToastService,
  AbstractDetailComponent,
  getSlugFromHref
} from '@nusantara/core';
import { inventory, ISubLocation, IWarehouse } from '@nusantara/models';
import { InventoryTransferService } from '@nusantara/services';
import { IProductClass } from '@nusantara/models/products';
import { IStockRecord, ReceivingOrderStatusChoices } from '@nusantara/models/inventory';
import {ConfirmModalReceivingOrderComponent, StockRecordSelectionModalComponent} from '@nusantara/shared';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * Allows a user to receive a new batch of inventory.
 */
@Component({
  selector: 'nus-inventory-transfer',
  template: `
    <h1 class="title-1" i18n>Inventory Transfer</h1>

    <form [formGroup]="form" (ngSubmit)="save()">
      <table class="header">
        <tbody>
          <tr>
           <td colspan="1" class="">
             Created By
           </td>
           <td colspan="1">
             Created Date
           </td>
          </tr>
          <tr>
            <td colspan="1" class="bold">{{ userDisplayName }}</td>
            <td colspan="1" class="bold">{{ currentDate|date }}</td>
          </tr>
        </tbody>
      </table>
      <table class="inventory-order-meta">
        <tbody>
        <tr>
          <td [formGroup]="warehouse" class="bold">
            Source Warehouse
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
          <td [formGroup]="destinationWarehouse" class="bold">
            Destination Warehouse
            <select formControlName="href" data-qa="destination-warehouse">
              <option [ngValue]="null">---</option>
              <option *ngFor="let wh of destinationWarehouses" [value]="wh.href">
                {{ wh.name }}
              </option>
            </select>
          </td>
          <td class="confirm-wh">
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
              <th class="product-name" i18n>Product Name / Sender Location</th>
              <th class="product-sku" i18n>SKU</th>
              <th i18n>Batch</th>
              <th i18n>Expiry Date</th>
              <th class="stock" i18n>Stock Available</th>
              <th class="stock" i18n>Transfer Quantity</th>
              <th class="action" i18n>Remove</th>
            </tr>
          </thead>
          <tbody>

          <nus-inventory-transfer-line
            *ngFor="let rec of stockRecords.controls; let i=index"
            [productClasses]="productClasses"
            (remove)="removeLine(i)"
            [formGroup]="rec"
            [availableStockList]="availableStockList"
          >
          </nus-inventory-transfer-line>

          <tr>
            <td colspan="9">
              <button type="button" (click)="addLine()" class="new-add-button wide" i18n>
                <i class="material-icons">add</i> Add Record
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
    <nus-stock-record-selection-modal [isTransferDisplay]="true"></nus-stock-record-selection-modal>
    <nus-confirm-receiving-modal></nus-confirm-receiving-modal>
  `,
  styles: [`
    form { max-width: 100%; }
    .inventory-order-meta {
      width: 100%;
      padding: 16px 0px;
    }
    .inventory-order-meta th {
      text-align: left;
    }
    .line-items {
      margin-top: 25px;
    }
    .bold {
      font-weight: bold;
    }
    form table.header, form table.inventory-order-meta {
      width: 58vw;
    }
    table.header tbody tr td, table.inventory-order-meta tbody tr td {
      border: none;
      padding: 0px 0px 0px 24px;
    }
    table.header {
      padding: 20px 0px 20px 24px;
      margin-bottom: 16px;
    }
    table.header tbody tr {
      height: 24px;
    }
    table.header tbody tr td {
      width: 50%;
    }
    table.inventory-order-meta tbody tr {
      height: 72px;
    }
    table.inventory-order-meta tbody tr td.confirm-wh {
      padding-top: 20px;
    }
    th.stock, th.action {
      width: 10%;
    }
    th.product-name {
      width: 35%;
    }
    th.product-sku {
      width: 15%;
    }
  `
  ]
})
export class InventoryTransferOrderComponent extends AbstractDetailComponent<inventory.ITransferOrder>
  implements OnInit, AfterViewInit, OnDestroy {

  warehouses: IWarehouse[];
  productClasses: IProductClass[] = [];
  currentDate: Date;
  destinationWarehouses: IWarehouse[];
  productType: string = 'single';
  @ViewChild(StockRecordSelectionModalComponent) stockRecordSelectionModal: StockRecordSelectionModalComponent;
  @ViewChild(ConfirmModalReceivingOrderComponent) confirmModalReceiving: ConfirmModalReceivingOrderComponent;
  availableStockList: Array<{
    href: string,
    amount: number
  }> = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private fb: FormBuilder,
              toast: ToastService,
              public authService: AuthService,
              service: InventoryTransferService,
              route: ActivatedRoute,
              router: Router,
              private cdr: ChangeDetectorRef) {
    super(route, router, toast, service);
  }

  get warehouse(): FormGroup { return this.form.get('warehouse') as FormGroup; }
  get destinationWarehouse(): FormGroup { return this.form.get('destinationWarehouse') as FormGroup; }
  get stockRecords(): FormArray { return this.form.get('stockRecords') as FormArray; }
  get notes(): FormControl { return this.form.get('notes') as FormControl; }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: { warehouses: IWarehouse[], productClasses: IProductClass[]}) => {
      this.productClasses = data.productClasses;
      this.warehouses = data.warehouses;
      this.resetForm();
    });
    this.currentDate = new Date();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngAfterViewInit() {
    // wire-up modal closed callback
    this.stockRecordSelectionModal.onClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.onProductSelectionModalClosed());
    this.confirmModalReceiving.onClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.onConfirmModalClosed());
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
    // this.productSelectionModal.open();
    this.stockRecordSelectionModal.filters = {
      warehouse: getSlugFromHref(this.warehouse.value?.href),
      receiving_order_status: ReceivingOrderStatusChoices.APPROVED,
      product_type: 'single',
      min_amount: '1'
    };
    this.stockRecordSelectionModal.displayedResults = null;
    this.stockRecordSelectionModal.onSearchTextChanged('');
    this.stockRecordSelectionModal.open();
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
      this.warehouse.disable();
      this.destinationWarehouse.disable();
    }
  }

  onProductSelectionModalClosed() {
    if (this.stockRecordSelectionModal.result === DialogResult.OK) {
      // add a new child to the form group based on the modal

      const selectedStock = this.stockRecordSelectionModal.stockRecord.value as IStockRecord;
      // todo: see if the product class has an expiry date associated with it?
      // if so, we need to add a required validator to that field.
      // const expiryValidators = [];
      // if (selectedProduct.productClass)
      // disable digital products/subscription receiving.

      const f = this.fb.group({
        inventoryReceiving: [selectedStock.receivingOrder, []],
        product: [selectedStock.product, [Validators.required]],
        href: [selectedStock.href, []],
        location:  [selectedStock.location, [Validators.required]],
        sku: [selectedStock.sku, [Validators.required, ]],
        originalQuantity: [1, [Validators.required, Validators.min(1), ]],
        batchNumber: [selectedStock.batchNumber, []],
        locator: this.fb.array(selectedStock.locator, [Validators.minLength(1)]),
        expiryDate: [selectedStock.expiryDate, [Validators.required,]]
      });
      this.stockRecords.push(f);
      this.availableStockList.push({
        href: selectedStock.href,
        amount: selectedStock.originalQuantity
      });
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
    this.cdr.detectChanges();
    this.form.reset();
    this.warehouse.enable();
    this.destinationWarehouse.enable();
    this.stockRecords.clear();
  }

  removeLine(index: number) {
    this.stockRecords.removeAt(index);
    this.availableStockList.splice(index, 1);
  }

  confirmModal() {
    this.confirmModalReceiving.open();
  }

  onConfirmModalClosed() {
    if (this.confirmModalReceiving.result === DialogResult.OK) {
      this.resetForm(true);
    }
  }
}
