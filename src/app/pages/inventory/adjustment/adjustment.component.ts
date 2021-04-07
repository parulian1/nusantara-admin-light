import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AbstractDetailComponent,
  DialogResult,
  getSlugFromHref,
  IResultResponse,
  ToastLevelEnum,
  ToastService,
} from '@nusantara/core';
import { drf, inventory, ISubLocation, IWarehouse } from '@nusantara/models';
import { IAdjustment, IStockRecord } from '@nusantara/models/inventory';
import { AuthService } from '@nusantara/auth';
import { InventoryAdjustmentOrderService, MarketplaceClientService } from '@nusantara/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalReceivingOrderComponent, StockRecordSelectionModalComponent } from '@nusantara/shared';

@Component({
  selector: 'nus-adjustment',
  template: `
    <h1>Adjustment Order</h1>

    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="container">
        <div class="general-info">
          <h3>General Information</h3>
          <div>
            <label>Received By</label>
            <span>{{ userDisplayName }}</span>
          </div>
          <div>
            <label>Approved By</label>
            <span>-</span>
          </div>
          <div>
            <label>Receiving Date</label>
            <span>{{ currentDate|date }}</span>
          </div>
          <div>
            <label>Status</label>
            <span>Pending</span>
          </div>
          <div [formGroup]="warehouse">
            <label>Warehouse</label>
            <div class="confirm-warehouse">
              <select formControlName="href">
                <option [ngValue]="null">Select Warehouse</option>
                <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
                  {{ wh.name }}
                </option>
              </select>
              <button (click)="confirmWarehouse()" type="button"
                      [disabled]="warehouse.disabled || !warehouse.valid"
                      class="control confirm">
                Confirm
              </button>
            </div>
          </div>
        </div>
        <!-- <div class="mp-info">-->
          <!--  <h3>Marketplace Information</h3>-->
          <!--  <div>-->
          <!--    <div>Product</div>-->
          <!--    <div class="count">-->
          <!--      0-->
          <!--    </div>-->
          <!--  </div>-->
          <!--  <div>-->
          <!--    <div>Marketplace</div>-->
          <!--    <div class="count">-->
          <!--      0-->
          <!--    </div>-->
          <!--  </div>-->
          <!--  <div>-->
          <!--    <div>Store</div>-->
          <!--    <div class="count">-->
          <!--      0-->
          <!--    </div>-->
          <!--  </div>-->
          <!--  <a >More Detail</a>-->
        <!-- </div>-->
      </div>
      <div class="product-list" *ngIf="warehouse.disabled">
        <table>
          <thead>
          <tr id="mp-add-product-head">
            <th>Receiving ID / Product Name / Location</th>
            <th>SKU</th>
            <th>Receiving Date</th>
            <th>Available Stock In Product Record</th>
            <th>Adjusted Qty</th>
            <th>Different Qty</th>
            <th>Reason</th>
            <th>Notes</th>
            <th>Remove</th>
          </tr>
          </thead>
          <tbody>

          <nus-adjustment-line
            *ngFor="let rec of stockRecords.controls; let i=index"
            [form]="rec"
            [warehouse]="warehouse.value"
            [availableSubLocations]="availableSubLocations"
            [reasons]="reasonChoices"
            (remove)="stockRecords.removeAt(i)"
          >
          </nus-adjustment-line>

          <tr>
            <td colspan="10">
              <button type="button" (click)="addLine()" class="new-add-button wide">
                <i class="material-icons">add</i> Add Record
              </button>
            </td>
          </tr>
        </table>
      </div>


      <nus-detail-actions
        [component]="this"
        (cancel)="confirmModal()"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

    <!-- Modals -->
    <nus-stock-record-selection-modal></nus-stock-record-selection-modal>
    <nus-confirm-receiving-modal></nus-confirm-receiving-modal>
  `,
  styles: [
    'h1 { margin-bottom: 0.75rem; }',
    'form{ max-width: none;}',
    'h3 { font-size: 20px; margin: 0; }',
    'button.confirm { width: auto }',
    '.container { display: grid; grid-template-columns: 4fr 1fr; grid-gap: 24px; }',
    '.container > div { border: 1px solid var(--grey); border-radius: 4px; padding: 16px 24px; }',
    '.general-info { width: 100%; }',
    '.general-info > h3 { margin-bottom: 20px; }',
    '.general-info > div:not(:last-child) { margin-bottom: 23px; }',
    '.general-info label { min-height: 0; }',
    '.general-info span{ font-weight: 700; color: var(--darken-grey); }',
    '.mp-info > h3 { margin-bottom: 16px; }',
    '.mp-info > div { text-align: center; border: 1px solid var(--grey); border-radius: 4px; padding: 12px 16px; margin-bottom: 12px; }',
    '.mp-info > a { display: block; margin-top: 16px; }',
    '.mp-info .count { font-size: 28px; font-weight: 700; }',
    '.confirm-warehouse { display: grid; grid-template-columns: 5fr 1fr; grid-gap: 24px; }',
    '.product-list { margin-top: 24px; }',
  ]
})
export class AdjustmentComponent extends AbstractDetailComponent<inventory.IAdjustment> implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild(StockRecordSelectionModalComponent) stockRecordSelectionModal: StockRecordSelectionModalComponent;
  @ViewChild(ConfirmModalReceivingOrderComponent) confirmModalReceiving: ConfirmModalReceivingOrderComponent;

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  reasonChoices: drf.IChoice[] = [
    { value: 'opname', displayName: 'OpName' },
    { value: 'damaged', displayName: 'Damaged' },
    { value: 'missed', displayName: 'Missing' },
    { value: 'misplace', displayName: 'Found/Misplace' },
  ];

  currentDate: Date;
  productValue = 0;
  storeValue = 0;

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public authService: AuthService,
              public service: InventoryAdjustmentOrderService,
              public clientService: MarketplaceClientService,
              public route: ActivatedRoute,
              public router: Router) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[] }) => {
      this.warehouses = data.warehouses;
    });
    this.currentDate = new Date();
  }

  ngAfterViewInit() {
    this.stockRecordSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.confirmModalReceiving.onClose.subscribe(() => this.onConfirmModalClosed());
  }

  initializeForm(entity?: IAdjustment): void {
    this.form = this.fb.group({
      warehouse: this.fb.group({
        href: [null, Validators.required],
      }),
      stockRecords: this.fb.array(
        [], [Validators.required, Validators.minLength(1)]
      ),
    });
  }

  get stockRecords(): FormArray {
    return this.form.get('stockRecords') as FormArray;
  }

  get warehouse(): FormGroup {
    return this.form.get('warehouse') as FormGroup;
  }

  get userDisplayName(): string {
    const email = this.authService.tokenPayload?.email ?? '';
    const fullName = `${this.authService.tokenPayload?.last_name} ${this.authService.tokenPayload?.first_name}`.trim();

    if (fullName && email) {
      return [fullName, `(${email})`, ].join(', ').trim();
    } else {
      return email;
    }
  }

  addLine() {
    this.stockRecordSelectionModal.filters = {
      warehouse: getSlugFromHref(this.warehouse.value?.href),
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
    const wh = this.warehouses.filter(e => e.href === this.warehouse.get('href').value)[0];
    if (wh) {
      this.availableSubLocations = wh.subLocations || [];
      this.warehouse.disable();
    }
  }

  onProductSelectionModalClosed(): void {
    if (this.stockRecordSelectionModal.result === DialogResult.OK) {
      const selectedStock = this.stockRecordSelectionModal.stockRecord.value as IStockRecord;

      // available stock
      if (selectedStock.originalQuantity <= 0) { alert('selected receiving order doesnt have stock'); }

      const newReceiving = this.fb.group({
        href: [null, []],
        receivingOrder: [selectedStock.receivingOrder, [Validators.required]],
        location: [selectedStock.location, []],
        product: [selectedStock.product, [Validators.required]],
        sku: [{value: selectedStock.sku, disabled: true}],
        originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
        differenceQty: [selectedStock.originalQuantity, [Validators.required, Validators.min(0)]],
        adjustmentQuantity: [null, [Validators.required]],
        created: [{value: selectedStock.created, disabled: true}],
        reason: [this.reasonChoices[0].value, []],
        notes: [null, []],
      });

      this.stockRecords.push(newReceiving);
    }
  }

  onConfirmModalClosed() {
    if (this.confirmModalReceiving.result === DialogResult.OK) {
      this.resetForm();
    }
  }

  resetForm() {
    this.form.reset();
    this.warehouse.enable();
    this.stockRecords.clear();
  }

  confirmModal() {
    this.confirmModalReceiving.open();
  }

  getFormValue() {
    return {
      ...this.form.getRawValue(),
      createdBy: {
        href: `https://${this.authService.tokenPayload?.site}/users/${this.authService.tokenPayload?.user_id}/`
      },
      reviewedBy: {}
    };
  }

  protected onSaveSuccess(result: IResultResponse<inventory.IAdjustment>) {
    this.resetForm();

    this.storeValue = this.productValue = 0;
    this.toast?.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
    this.navigateToParent(false);
  }
}
