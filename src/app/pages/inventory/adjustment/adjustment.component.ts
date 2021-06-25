import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  AbstractDetailComponent,
  DialogResult,
  getSlugFromHref,
  IResultResponse,
  ToastLevelEnum,
  ToastService,
} from '@nusantara/core';
import {drf, inventory, ISubLocation, IWarehouse, marketplace} from '@nusantara/models';
import {IAdjustment, IStockRecord, ReceivingOrderStatusChoices} from '@nusantara/models/inventory';
import {AuthService} from '@nusantara/auth';
import {
  InventoryAdjustmentOrderService,
  InventoryStockRecordService,
  MarketplaceClientService,
  WarehouseService
} from '@nusantara/services';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmModalReceivingOrderComponent, StockRecordSelectionModalComponent} from '@nusantara/shared';
import {CsvDialogComponent} from '@nusantara/shared/csv-dialog/csv-dialog.component';
import * as Papa from 'papaparse';
import {HttpParams} from '@angular/common/http';
import {StockRecordDialogComponent} from '@nusantara/pages/inventory/adjustment/stock-record-dialog.component';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'nus-adjustment',
  template: `
    <h1>Adjustment Order</h1>

    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="container">
        <div class="general-info">
          <h3>General Information</h3>
          <div>
            <label>Adjusted By</label>
            <span>{{ userDisplayName }}</span>
          </div>
          <div>
            <label>Approved By</label>
            <span>-</span>
          </div>
          <div>
            <label>Adjustment Date</label>
            <span>{{ currentDate|date }}</span>
          </div>
          <div>
            <label>Status</label>
            <span>Pending</span>
          </div>
          <div>
            <label>Warehouse</label>
            <div class="confirm-warehouse">

              <div [formGroup]="warehouse">
                <select formControlName="href" (change)="warehouseSelected($event)">
                  <option [ngValue]="null">Select Warehouse</option>
                  <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
                    {{ wh.name }}
                  </option>
                </select>
              </div>

              <div [formGroup]="subLocation">
                <select formControlName="href" (change)="subLocationSelected($event)" [disabled]="!warehouse.valid">
                  <option [ngValue]="null">Select Location</option>
                  <option *ngFor="let subLocation of availableSubLocations" [ngValue]="subLocation.href">
                    {{ subLocation.name }}
                  </option>
                </select>
              </div>

              <div class="confirm-warehouse-action">
                <button (click)="confirmWarehouse()" type="button"
                        [disabled]="subLocation.disabled || !warehouse.valid || !subLocation.valid"
                        class="control confirm">Manual Update
                </button>
                <div class="dropdown" [class.disabled]="subLocation.disabled || !warehouse.valid || !subLocation.valid">
                  <button type="button"
                          [disabled]="subLocation.disabled || !warehouse.valid"
                          class="dropbtn"><span class="material-icons">keyboard_arrow_down</span>
                  </button>
                  <div class="dropdown-content">
                    <button (click)="manualUpload()" type="button"
                            [disabled]="subLocation.disabled || !warehouse.valid"
                            class="control confirm secondary">
                      Manual Upload
                    </button>
                  </div>
                </div>
              </div>

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
      <div class="product-list" *ngIf="warehouse.disabled && adjustmentMode === 'csv'">
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
            [csvData]="csvData[i]"
            [index]="i"
            [length]="stockRecords.length"
            (remove)="stockRecords.removeAt(i)"
            (conflict)="resolveConflict($event)"
          >
          </nus-adjustment-line>
          </tbody>

        </table>
        <nus-detail-actions
          [component]="this"
          (cancel)="confirmModal()"
          (delete)="delete()">
        </nus-detail-actions>
      </div>
      <div class="product-list" *ngIf="warehouse.disabled && adjustmentMode === 'manual'">
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
            [adjustmentMode]="adjustmentMode"
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

        <nus-detail-actions
          [component]="this"
          (cancel)="confirmModal()"
          (delete)="delete()">
        </nus-detail-actions>
      </div>
    </form>

    <!-- Modals -->
    <nus-stock-record-selection-modal></nus-stock-record-selection-modal>
    <nus-confirm-receiving-modal [cancelWithoutReload]="true"></nus-confirm-receiving-modal>
    <nus-csv-dialog></nus-csv-dialog>
    <nus-stock-record-dialog></nus-stock-record-dialog>
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
    '.confirm-warehouse { display: grid; grid-template-columns: 2fr 2fr 1fr; grid-gap: 24px; }',
    '.product-list { margin-top: 24px; }',
    '.dropdown.disabled:hover .dropdown-content { display: none; }',
    '.dropdown.disabled:hover .dropbtn { background-color: var(--grey); }',
    '.dropdown.disabled .dropbtn { background-color: var(--grey); }',
    '.confirm-warehouse-action .dropbtn { height: 40px; background: var(--secondary); padding: inherit; }',
    '.confirm-warehouse-action .control { border-radius: 4px 0 0 4px; }',
    '.confirm-warehouse-action  { display: flex; border-radius: 4px;  }',
    '.dropdown button.dropbtn { display: flex; align-items: center;  border-radius: 0 4px 4px 0; }',
    '.confirm-warehouse-action  > button { flex: 1; }',
    '.confirm-warehouse-action .dropdown-content { right: 0; }',
    '.dropdown-content button.confirm { width: 100%; }'
  ]
})
export class AdjustmentComponent extends AbstractDetailComponent<inventory.IAdjustment> implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild(StockRecordSelectionModalComponent) stockRecordSelectionModal: StockRecordSelectionModalComponent;
  @ViewChild(ConfirmModalReceivingOrderComponent) confirmModalReceiving: ConfirmModalReceivingOrderComponent;
  @ViewChild(CsvDialogComponent) csvDialog: CsvDialogComponent;
  @ViewChild(StockRecordDialogComponent) stockRecordDialog: StockRecordDialogComponent;

  warehouses: IWarehouse[];
  availableSubLocations: ISubLocation[] = [];
  reasonChoices: drf.IChoice[] = [
    {value: 'opname', displayName: 'OpName'},
    {value: 'damaged', displayName: 'Damaged'},
    {value: 'missed', displayName: 'Missing'},
    {value: 'misplace', displayName: 'Found/Misplace'},
  ];

  currentDate: Date;
  productValue = 0;
  storeValue = 0;
  csvData = [];
  parsedCsv: any;
  adjustmentMode = 'manual';

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public authService: AuthService,
              public service: InventoryAdjustmentOrderService,
              public clientService: MarketplaceClientService,
              public warehouseService: WarehouseService,
              protected inventoryService: InventoryStockRecordService,
              public route: ActivatedRoute,
              public router: Router,
              private ref: ChangeDetectorRef) {
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
    super.ngAfterViewInit();
    this.stockRecordSelectionModal.onClose.subscribe(() => this.onProductSelectionModalClosed());
    this.confirmModalReceiving.onClose.subscribe(() => this.onConfirmModalClosed());
    this.csvDialog.onClose.subscribe(() => this.manualUploadClose());
    this.stockRecordDialog.onClose.subscribe(() => this.onStockRecordDialogClosed());
  }

  initializeForm(entity?: IAdjustment): void {
    this.form = this.fb.group({
      warehouse: this.fb.group({
        href: [null, Validators.required],
      }),
      subLocation: this.fb.group({
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

  get subLocation(): FormGroup {
    return this.form.get('subLocation') as FormGroup;
  }

  get userDisplayName(): string {
    const email = this.authService.tokenPayload?.email ?? '';
    const fullName = `${this.authService.tokenPayload?.last_name} ${this.authService.tokenPayload?.first_name}`.trim();

    if (fullName && email) {
      return [fullName, `(${email})`,].join(', ').trim();
    } else {
      return email;
    }
  }

  addLine() {
    this.stockRecordSelectionModal.filters = {
      warehouse: getSlugFromHref(this.warehouse.value?.href),
      receiving_order_status: ReceivingOrderStatusChoices.APPROVED,
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
      this.adjustmentMode = 'manual';
    }
  }

  onProductSelectionModalClosed(): void {
    if (this.stockRecordSelectionModal.result === DialogResult.OK) {
      const selectedStock = this.stockRecordSelectionModal.stockRecord.value as IStockRecord;

      // available stock
      if (selectedStock.originalQuantity <= 0) {
        alert('selected receiving order doesnt have stock');
      }

      const newReceiving = this.fb.group({
        href: [null, []],
        receivingOrder: [selectedStock.receivingOrder, [Validators.required]],
        location: [selectedStock.location, []],
        product: [selectedStock.product, [Validators.required]],
        sku: [{value: selectedStock.sku, disabled: true}],
        originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
        differenceQty: [selectedStock.originalQuantity, [Validators.min(0)]],
        adjustmentQuantity: [null, [Validators.required, Validators.min(-32767), Validators.max(32767)]],
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

  save(): void {
    if (this.form.valid) {
      super.save();
    }
  }

  protected onSaveSuccess(result: IResultResponse<inventory.IAdjustment>) {
    this.resetForm();

    this.storeValue = this.productValue = 0;
    this.toast?.addMessage(`"${this.form.get('name')?.value ?? 'data'}" was saved successfully.`, 'Saved', ToastLevelEnum.success);
    this.navigateToParent(false);
  }

  warehouseSelected($event: Event) {
    if (($event.target as HTMLSelectElement).value !== '') {
      const wh = this.warehouses.filter(e => e.href === this.warehouse.get('href').value)[0];
      if (wh) {
        this.availableSubLocations = wh.subLocations || [];
        // this.warehouse.disable();
      }
    } else {

    }
  }

  subLocationSelected($event: Event) {
    if (($event.target as HTMLSelectElement).value !== '') {
      // this.subLocation.disable();
    }
  }

  manualUpload() {

    // this.csvDialog.filters = {
    //   warehouse: getSlugFromHref(this.warehouse.value?.href),
    //   receiving_order_status: ReceivingOrderStatusChoices.APPROVED,
    // };

    this.adjustmentMode = 'csv';
    this.csvDialog.fileTarget = null;
    this.csvDialog.columnChoices = {
      upc: '',
      qty: '',
      reason: '',
      sku: '',
      notes: ''
    };

    this.csvDialog.currentStep = 'start';
    this.csvDialog.open();
  }

  manualUploadClose() {
    if (this.csvDialog.result === DialogResult.OK) {
      console.log(this.csvDialog.columnChoices);
      console.log(this.csvDialog.fileTarget);
      this.warehouse.disable();
      this.subLocation.disable();
      this.adjustmentMode = 'csv';

      const target: DataTransfer = this.csvDialog.fileTarget as DataTransfer;
      // Direct
      Papa.parse(target.files[0],
        {
          header: this.csvDialog.hasCsvHeader,
          skipEmptyLines: true,
          complete: (results) => {
            this.csvData = [];
            this.parsedCsv = results;
            results.data.map((value, key) => {
              const filters = {
                warehouse: getSlugFromHref(this.warehouse.value?.href),
                sub_location: getSlugFromHref(this.subLocation.value?.href),
                receiving_order_status: ReceivingOrderStatusChoices.APPROVED,
              };
              const upc = this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['upc']] : value[+(this.csvDialog.columnChoices['upc']) - 1];
              this.inventoryService.fetchListWithFilter(
                upc, 1, 10, filters
              ).subscribe(res => {
                // TODO: Validation

                const mappedValue = {
                  upc: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['upc']] : value[+(this.csvDialog.columnChoices['upc']) - 1],
                  qty: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['qty']] : value[+(this.csvDialog.columnChoices['qty']) - 1],
                  reason: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['reason']] : value[+(this.csvDialog.columnChoices['reason']) - 1],
                  sku: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['sku']] : value[+(this.csvDialog.columnChoices['sku']) - 1],
                  notes: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['notes']] : value[+(this.csvDialog.columnChoices['notes']) - 1]
                };

                const isRandomReason = this.reasonChoices.find(v => mappedValue.reason === v.value);

                if (mappedValue.reason === '' || isRandomReason === undefined) {
                  mappedValue.reason = 'opname';
                }

                const dataResult = {
                  page: res,
                  data: value,
                  key,
                  mappedValue
                };
                if (res.totalResults > 0) {
                  this.csvData.push(dataResult);
                  const selectedStock = res.entities[0];
                  const sku = mappedValue.sku || selectedStock.sku;
                  const newReceiving = this.fb.group({
                    href: [null, []],
                    receivingOrder: [selectedStock.receivingOrder, [Validators.required]],
                    location: [selectedStock.location, []],
                    product: [selectedStock.product, [Validators.required]],
                    sku: [{value: sku, disabled: true}],
                    originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
                    differenceQty: [mappedValue.qty, [Validators.min(0)]],
                    adjustmentQuantity: [null, [Validators.required, Validators.min(-32767), Validators.max(32767)]],
                    created: [{value: selectedStock.created, disabled: true}],
                    reason: [mappedValue['reason'], []],
                    notes: [mappedValue.notes || null, []],
                  });
                  this.stockRecords.push(newReceiving);
                }
              });
            });
          }
        });
    }
  }

  resolveConflict($event: { index: number; data: any }) {
    console.log('Need resolve ', this.stockRecords[$event.index]);
    console.log('Data ', $event.data);
    // this.stockRecordDialog.stockRecord = this.stockRecords[$event.index];
    this.stockRecordDialog.displayedResults = $event.data.page;
    this.stockRecordDialog.stockRecordIndex = $event.index;
    this.stockRecordDialog.stockRecordData = $event.data;
    this.stockRecordDialog.open();
  }

  private onStockRecordDialogClosed() {
    if (this.stockRecordDialog.result === DialogResult.OK) {
      const selectedStock = this.stockRecordDialog.stockRecord.value as IStockRecord;
      const newReceiving = this.fb.group({
        href: [null, []],
        receivingOrder: [selectedStock.receivingOrder, [Validators.required]],
        location: [selectedStock.location, []],
        product: [selectedStock.product, [Validators.required]],
        sku: [{value: selectedStock.sku, disabled: true}],
        originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
        differenceQty: [this.stockRecordDialog.stockRecordData.mappedValue.qty, [Validators.min(0)]],
        adjustmentQuantity: [null, [Validators.required, Validators.min(-32767), Validators.max(32767)]],
        created: [{value: selectedStock.created, disabled: true}],
        reason: [this.reasonChoices[0].value, []],
        notes: [null, []],
      });
      this.stockRecords.controls[this.stockRecordDialog.stockRecordIndex] = newReceiving;
      this.ref.detectChanges();
    }
  }
}
