import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogResult, PagedResponse} from '@nusantara/core';
import {Subscription} from 'rxjs';
import {IStockRecord} from '@nusantara/models/inventory';
import {InventoryStockRecordService} from '@nusantara/services';
import {getSlugFromHref} from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-stock-record-dialog',
  template: `
    <ngx-smart-modal [identifier]="'selectStockRecord'" #modal [formGroup]="form" [customClass]="'wide-modal'">
      <h2 class="heading-2" i18n>Select Record</h2>
      <form #modalForm class="fluid">
        <input type="hidden" [formControl]="stockRecord">
        <p i18n>Showing 10 recently added product records. Search product name or SKU to find more products.</p>
        <table>
          <colgroup>
            <col class="product-name">
            <col class="product-sku">
            <col>
          </colgroup>
          <thead>
          <tr style="background-color: #F4F4F4;">
            <th class="product-name" i18n>Receiving ID / Product Name / Location</th>
            <th class="product-sku" i18n>SKU</th>
            <th class="stock-date" i18n>Receiving Date</th>
            <th class="product-original-qty" i18n>Original Qty</th>
            <th class="centered" i18n>Action</th>
          </tr>
          </thead>
          <tbody *ngIf="displayedResults; else loading">
          <tr *ngFor="let p of displayedResults?.entities">
            <td class="product-name">
              {{ displayReceivingID(p.receivingOrder.href) }} / {{ p.product.name }} / {{ p.location.name }}
            </td>
            <td class="product-sku">{{ p.sku }}</td>
            <td class="stock-date">{{ p.expiryDate | date }}</td>
            <td class="product-original-qty">{{ p.originalQuantity }}</td>
            <td class="centered"><a href="#" (click)="selectStockRecord(p)" i18n>Add</a></td>
          </tr>
          </tbody>

          <ng-template #loading>
            <tbody>
            <tr>
              <td colspan="4" i18n>
                Loading...
              </td>
            </tr>
            </tbody>
          </ng-template>

        </table>
      </form>
    </ngx-smart-modal>
  `,
  styles: [
  ]
})
export class StockRecordDialogComponent implements OnInit {
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<IStockRecord> = null;
  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  filters = {};

  isInStock = true;

  stockRecordIndex: number;
  stockRecordData: any;

  constructor(
    protected fb: FormBuilder,
    protected service: InventoryStockRecordService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      searchText: ['', [ ]],
      stockRecord: ['', [Validators.required, ]],
    });
  }
  get stockRecord(): FormControl { return this.form.get('stockRecord') as FormControl; }


  displayReceivingID(href: string): string {
    return getSlugFromHref(href);
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  open() {
    this.modal.open();
  }

  selectStockRecord(stockRecord: IStockRecord) {
    this.stockRecord.setValue(stockRecord);
    this.close();
    return false;
  }

  get onClose(): EventEmitter<any> {
    return this.modal.onClose;
  }

  close() {
    this.result = DialogResult.OK;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }

}
