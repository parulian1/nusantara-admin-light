import {AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  AbstractDetailComponent,
  DialogResult,
  getSlugFromHref,
  IResultResponse,
  ToastLevelEnum,
  ToastService,
} from '@nusantara/core';
import {drf, inventory, ISubLocation, IWarehouse} from '@nusantara/models';
import {IAdjustment, IStockRecord, ReceivingOrderStatusChoices} from '@nusantara/models/inventory';
import {AuthService} from '@nusantara/auth';
import {
  InventoryAdjustmentOrderService,
  InventoryStockRecordService,
  MarketplaceClientService,
  WarehouseService
} from '@nusantara/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalInventoryOrderComponent, StockRecordSelectionModalComponent } from '@nusantara/shared';
import { CsvDialogComponent } from '@nusantara/shared/csv-dialog/csv-dialog.component';
import * as Papa from 'papaparse';
import {StockRecordDialogComponent} from '@nusantara/pages/inventory/adjustment/stock-record-dialog.component';
import { isNumeric } from 'rxjs/internal/util/isNumeric';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'nus-adjustment',
  template: `
    <h1 i18n>Stock Adjustment</h1>

    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="container">
        <div>
          <div id="general-info" class="wrapper">
            <div>
              <label i18n>Created By</label>
              <span>{{ userDisplayName }}</span>
            </div>
            <div>
              <label i18n>Created Date</label>
              <span>{{ currentDate|date }}</span>
            </div>
          </div>
          <div id="warehouse-info" class="wrapper">
            <div>
              <label i18n>Warehouse</label>
              <div class="confirm-warehouse">
                <div [formGroup]="warehouse">
                  <select formControlName="href" (change)="warehouseSelected($event)">
                    <option [ngValue]="null" i18n>Select Warehouse</option>
                    <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
                      {{ wh.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label i18n>Location</label>
              <div class="confirm-warehouse">
                <div [formGroup]="subLocation">
                  <select formControlName="href" (change)="subLocationSelected($event)">
                    <option [ngValue]="null" i18n>Select Location</option>
                    <option *ngFor="let subLocation of availableSubLocations" [ngValue]="subLocation.href">
                      {{ subLocation.name }}
                    </option>
                  </select>
                </div>

                <div class="confirm-warehouse-action">
                  <button (click)="confirmWarehouse()" type="button"
                          [disabled]="subLocation.disabled || !warehouse.valid || !subLocation.valid"
                          class="control confirm" i18n>Manual Update
                  </button>
                  <div class="dropdown"
                       [class.disabled]="subLocation.disabled || !warehouse.valid || !subLocation.valid">
                    <button type="button"
                            [disabled]="subLocation.disabled || !warehouse.valid"
                            class="dropbtn"><span class="material-icons">keyboard_arrow_down</span>
                    </button>
                    <div class="dropdown-content">
                      <button (click)="manualUpload()" type="button"
                              [disabled]="subLocation.disabled || !warehouse.valid"
                              class="control confirm secondary" i18n>
                        CSV Upload
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
      </div>
      <div class="product-list" *ngIf="warehouse.disabled && adjustmentMode === 'csv'">
        <div *ngIf="invalidCsv.length > 0">
          <div>
            <a [href]="getInvalidCsv()" target="_blank" class="error-detail" i18n>Get invalid csv ({{invalidCsv.length}}
              records)</a>
          </div>
          <div *ngFor="let iCsv of invalidCsv" hidden="true">
            {{iCsv.reason}} - {{iCsv.data['upc']}}
          </div>
        </div>
        <table>
          <thead>
          <tr id="mp-add-product-head">
            <th i18n>Receiving ID / Product Name</th>
            <th i18n class="numeric">Stock</th>
            <th i18n>Adjusted Qty*</th>
            <th i18n class="numeric">Different Qty</th>
            <th i18n>Reason</th>
            <th i18n>Note</th>
            <th i18n>Remove</th>
            <th>
              <div class="dropdown">
                <i class="material-icons">more_vert</i>
                <div class="dropdown-content">
                  <button (click)="toggleAllDetail(true)" class="toggle-all-detail-button" type="button">
                    <span class="body-2">Expand all</span>
                  </button>
                  <button (click)="toggleAllDetail(false)" class="toggle-all-detail-button" type="button">
                    <span class="body-2">Hide all</span>
                  </button>
                </div>
              </div>
            </th>
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
            (remove)="removeLineItem(i)"
            (conflict)="resolveConflict($event)"
            (openDetail)="openDetail(i)"
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
            <th i18n>Receiving ID / Product Name</th>
            <th i18n class="numeric">Stock</th>
            <th i18n>Adjusted Qty*</th>
            <th i18n class="numeric">Different Qty</th>
            <th i18n>Reason</th>
            <th i18n>Note</th>
            <th i18n>Remove</th>
            <th>
              <div class="dropdown" [class.disabled]="stockRecords.controls.length == 0">
                <i class="material-icons">more_vert</i>
                <div class="dropdown-content">
                  <button (click)="toggleAllDetail(true)" class="toggle-all-detail-button" type="button" i18n>
                    <span class="body-2">Expand all</span>
                  </button>
                  <button (click)="toggleAllDetail(false)" class="toggle-all-detail-button" type="button" i18n>
                    <span class="body-2">Hide all</span>
                  </button>
                </div>
              </div>
            </th>
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
            (openDetail)="openDetail(i)"
          >
          </nus-adjustment-line>

          <tr>
            <td colspan="11">
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
    <nus-stock-record-selection-modal></nus-stock-record-selection-modal>
    <nus-confirm-inventory-modal [cancelWithoutReload]="true"></nus-confirm-inventory-modal>
    <nus-csv-dialog></nus-csv-dialog>
    <nus-stock-record-dialog></nus-stock-record-dialog>
  `,
  styles: [
    'h1 { margin-bottom: 0.75rem; }',
    'form{ max-width: none;}',
    'h3 { font-size: 20px; margin: 0; }',
    'button.confirm { width: auto }',
    '.container { display: grid; grid-template-columns: 4fr 1fr; grid-gap: 24px; }',
    '.wrapper { border: 1px solid var(--grey); border-radius: 4px; padding: 16px 24px; }',
    '.wrapper:not(:last-child) { margin-bottom: 24px; }',
    '.wrapper label { min-height: 0; }',
    '.wrapper span{ font-weight: 700; color: var(--darken-grey); }',
    '#general-info { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 24px; }',
    '#warehouse-info > div:not(:last-child) { margin-bottom: 23px; }',
    '.mp-info > h3 { margin-bottom: 16px; }',
    '.mp-info > div { text-align: center; border: 1px solid var(--grey); border-radius: 4px; padding: 12px 16px; margin-bottom: 12px; }',
    '.mp-info > a { display: block; margin-top: 16px; }',
    '.mp-info .count { font-size: 28px; font-weight: 700; }',
    '.confirm-warehouse { display: grid; grid-template-columns: 3fr 1fr; grid-gap: 24px; }',
    '.product-list { margin-top: 24px; }',
    '.product-list > table > thead th {vertical-align: middle;}',
    'th:nth-child(1) { min-width: 115px; }',
    'th:nth-child(2) { width: 80px; }',
    'th:nth-child(3) { width: 108px; }',
    'th:nth-child(4) { width: 108px; }',
    'th:nth-child(7) { width: 5%; }',
    'th:last-child { width: 2%; }',
    '.dropdown.disabled:hover .dropdown-content { display: none; }',
    '.dropdown.disabled:hover .dropbtn { background-color: var(--grey); }',
    '.dropdown.disabled .dropbtn { background-color: var(--grey); }',
    '.confirm-warehouse-action .dropbtn { height: 40px; background: var(--secondary); padding: inherit; }',
    '.confirm-warehouse-action .control { border-radius: 4px 0 0 4px; }',
    '.confirm-warehouse-action  { display: flex; border-radius: 4px;  }',
    '.dropdown button.dropbtn { display: flex; align-items: center;  border-radius: 0 4px 4px 0; }',
    '.confirm-warehouse-action  > button { flex: 1; }',
    '.confirm-warehouse-action .dropdown-content { right: 0; }',
    '.dropdown-content button.confirm { width: 100%; }',
    '.dropdown-content { right: 0; }',
    `
      .toggle-all-detail-button {
        width: 100%;
        height: 36px;
        padding: 6px 16px;
        display: block;
        background: transparent;
        border: none;
        transition: all .5s;
        color: var(--darken-grey);
        text-align: left;
      }

      .toggle-all-detail-button:hover:not([disabled]) {
        background: var(--bhisma-orange);
        color: var(--white);
      }
    `
  ]
})
export class AdjustmentComponent extends AbstractDetailComponent<inventory.IAdjustment> implements OnInit, AfterViewInit {
  form: FormGroup;

  @ViewChild(StockRecordSelectionModalComponent) stockRecordSelectionModal: StockRecordSelectionModalComponent;
  @ViewChild(ConfirmModalInventoryOrderComponent) confirmModalReceiving: ConfirmModalInventoryOrderComponent;
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
  invalidCsv = [];
  upcList = [];
  selectedSubLocationId = 0;

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public authService: AuthService,
              public service: InventoryAdjustmentOrderService,
              public clientService: MarketplaceClientService,
              public warehouseService: WarehouseService,
              protected inventoryService: InventoryStockRecordService,
              public route: ActivatedRoute,
              public router: Router,
              private ref: ChangeDetectorRef,
              private sanitizer: DomSanitizer) {
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
        href: this.fb.control({value: null, disabled: true}, Validators.required),
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
      return [fullName, `(${email})`, ].join(', ').trim();
    } else {
      return email;
    }
  }

  addLine() {
    this.stockRecordSelectionModal.filters = {
      warehouse: getSlugFromHref(this.warehouse.value?.href),
      receiving_order_status: ReceivingOrderStatusChoices.APPROVED,
      product_type: 'single',
      sub_location: this.selectedSubLocationId
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
        href: [selectedStock.href, []],
        receivingOrder: [selectedStock.receivingOrder, [Validators.required]],
        location: [selectedStock.location, []],
        product: [selectedStock.product, [Validators.required]],
        sku: [{value: selectedStock.sku, disabled: true}],
        batch: [{value: selectedStock.batchNumber, disabled: true}],
        originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
        differenceQty: [selectedStock.originalQuantity, [Validators.min(0), Validators.max(10000)]],
        adjustmentQuantity: [null, [Validators.required, Validators.min(-32767), Validators.max(32767)]],
        created: [{value: selectedStock.created, disabled: true}],
        expiryDate: [{value: selectedStock.expiryDate, disabled: true}],
        reason: [this.reasonChoices[0].value, []],
        notes: [null, [Validators.maxLength(160)]],
        showDetail: [false, []], // Only for show hide detail row
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
    this.csvDialog.form.reset();
    this.csvDialog.csvNoHeader.disable();
    this.csvDialog.csvNoHeader.setValue(false);
    this.csvDialog.hasCsvHeader = false;
    this.invalidCsv = [];
    this.upcList = [];
    this.resetStockRecordDialog();
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
        this.subLocation.enable();
        // this.warehouse.disable();
      }
    }
  }

  subLocationSelected($event: Event) {
    if (($event.target as HTMLSelectElement).value !== '') {
      const loc = this.availableSubLocations.filter(e => e.href === this.subLocation.get('href').value)[0];
      // this.subLocation.disable();
      this.selectedSubLocationId = loc.id;
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

              let mappedHeaderReason = 'opname';
              if (value) {

                let reason = 'opname';
                if (this.csvDialog.hasCsvHeader) {
                  reason = value.Reason;
                } else {
                  reason = value[3];
                }

                if (reason === '' || reason === null || reason === undefined) {
                  mappedHeaderReason = 'opname';
                }

                const isReasonDisplayName = this.reasonChoices.find(v => v.displayName === reason);
                const isReasonValue = this.reasonChoices.find(v => v.value === reason);

                if (isReasonDisplayName !== undefined) {
                  mappedHeaderReason = isReasonDisplayName.value;
                }

                if (isReasonValue !== undefined) {
                  mappedHeaderReason = isReasonValue.value;
                }

              }

              const mappedValue = {
                upc: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['upc']] : value[+(this.csvDialog.columnChoices['upc']) - 1],
                qty: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['qty']] : value[+(this.csvDialog.columnChoices['qty']) - 1],
                reason: mappedHeaderReason,
                sku: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['sku']] : value[+(this.csvDialog.columnChoices['sku']) - 1],
                notes: this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['notes']] : value[+(this.csvDialog.columnChoices['notes']) - 1]
              };

              if (!isNumeric(mappedValue.qty)) {
                this.invalidCsv.push({
                  reason: 'Wrong Qty',
                  data: value
                });
                return;
              }

              const filters = {
                warehouse: getSlugFromHref(this.warehouse.value?.href),
                sub_location: getSlugFromHref(this.subLocation.value?.href),
                receiving_order_status: ReceivingOrderStatusChoices.APPROVED,
                search_fields: '=product__upc',
                product_type: 'single',
              };
              const upc = this.csvDialog.hasCsvHeader ? value[this.csvDialog.columnChoices['upc']] : value[+(this.csvDialog.columnChoices['upc']) - 1];
              if (upc.length < 2) {
                this.invalidCsv.push({
                  reason: 'UPC data too short',
                  data: mappedValue
                });
                return;
              }
              if (this.upcList.indexOf(upc) >= 0) {
                this.invalidCsv.push({
                  reason: 'Duplicate UPC',
                  data: value
                });
                return;
              }
              this.upcList.push(upc);
              this.inventoryService.fetchListWithFilterBackend(
                upc, 1, 20, filters
              ).subscribe(res => {
                // TODO: Validation

                const dataResult = {
                  page: res,
                  data: value,
                  key,
                  mappedValue
                };
                if (res.totalResults > 0) {
                  this.csvData.push(dataResult);
                  const selectedStock = res.entities[0];
                  const sku = selectedStock.sku;
                  const newReceiving = this.fb.group({
                    href: [null, []],
                    receivingOrder: [selectedStock.receivingOrder, [Validators.required]],
                    location: [selectedStock.location, []],
                    product: [selectedStock.product, [Validators.required]],
                    sku: [{value: sku, disabled: true}],
                    batch: [{value: selectedStock.batchNumber, disabled: true}],
                    originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
                    differenceQty: [mappedValue.qty, [Validators.min(0)]],
                    adjustmentQuantity: [null, [Validators.required, Validators.min(-32767), Validators.max(32767)]],
                    created: [{value: selectedStock.created, disabled: true}],
                    expiryDate: [{value: selectedStock.expiryDate, disabled: true}],
                    reason: [mappedValue.reason, []],
                    notes: [mappedValue.notes || null, []],
                    showDetail: [false, []],
                  });
                  this.stockRecords.push(newReceiving);
                } else {
                  this.invalidCsv.push({
                    reason: 'No Delivery Order/Stock Record found',
                    data: value
                  });
                }
              });
            });
          }
        });
    }
  }

  resolveConflict($event: { index: number; data: any }) {
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
        batch: [{value: selectedStock.batchNumber, disabled: true}],
        originalQuantity: [{value: selectedStock.originalQuantity, disabled: true}],
        differenceQty: [this.stockRecordDialog.stockRecordData.mappedValue.qty, [Validators.min(0)]],
        adjustmentQuantity: [null, [Validators.required, Validators.min(-32767), Validators.max(32767)]],
        created: [{value: selectedStock.created, disabled: true}],
        expiryDate: [{value: selectedStock.expiryDate, disabled: true}],
        reason: [this.reasonChoices[0].value, []],
        notes: [null, []],
        showDetail: [false, []], // Only for show hide detail row
      });
      this.stockRecords.controls[this.stockRecordDialog.stockRecordIndex] = newReceiving;
      this.ref.detectChanges();
    }
  }

  resetStockRecordDialog(): void {
    this.stockRecordDialog.displayedResults = null;
    this.stockRecordDialog.stockRecordIndex = null;
    this.stockRecordDialog.stockRecordData = null;
  }

  getInvalidCsv() {
    const forExport = [];
    let fields = [];
    if (this.invalidCsv.length > 0) {
      if (this.csvDialog.hasCsvHeader) {
        fields = [
          this.csvDialog.columnChoices.upc,
          this.csvDialog.columnChoices.qty,
          this.csvDialog.columnChoices.reason,
          this.csvDialog.columnChoices.sku,
          this.csvDialog.columnChoices.notes,
          'import_status'];
      }
      for (const csvData of this.invalidCsv) {
        const data = csvData.data;
        data.import_status = csvData.reason;
        forExport.push(data);
      }

      const csv = Papa.unparse(forExport);
      const blob = new Blob([csv], {type: 'text/plain'});
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    }

    return '';

  }

  openDetail(index: number) {
    const stockRecord = this.stockRecords.controls[index];
    stockRecord.get('showDetail').setValue(!stockRecord.get('showDetail').value);
  }
  toggleAllDetail(status: boolean) {
    // Open/close all detail row
    this.stockRecords.controls.forEach(stock => {
      stock.get('showDetail').setValue(status);
    });
  }

  removeLineItem(i: number): void {
    this.stockRecords.removeAt(i);
    this.csvData.splice(i,1)
  }
}
