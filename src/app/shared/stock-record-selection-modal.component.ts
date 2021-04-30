import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '../core';
import { InventoryStockRecordService } from '../services';
import { IStockRecord } from '@nusantara/models/inventory';
import { getSlugFromHref } from '@nusantara/shared/helpers';
import { map } from 'rxjs/operators';

/**
 * Shows the user a list of products they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on SKUs.
 */
@Component({
  selector: 'nus-stock-record-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectStockRecord'" #modal [formGroup]="form" [customClass]="'wide-modal'">
      <h2 class="heading-2">Select Record</h2>
      <form #modalForm class="fluid">
        <div class="search">
          <i class="material-icons">search</i>
          <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Name or SKU">
        </div>
        <input type="hidden" [formControl]="stockRecord">
        <p>Showing 10 recently added product records. Search product name or SKU to find more products.</p>
        <table>
          <colgroup>
            <col class="product-name">
            <col class="product-sku">
            <col>
          </colgroup>
          <thead>
          <tr style="background-color: #F4F4F4;">
            <th>Receiving ID / Product Name / Location</th>
            <th>SKU</th>
            <th>Receiving Date</th>
            <th>Original Qty</th>
            <th class="centered">Action</th>
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
            <td class="centered"><a href="#" (click)="selectStockRecord(p)">Add</a></td>
          </tr>
          </tbody>

          <ng-template #loading>
            <tbody>
            <tr>
              <td colspan="4">
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
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey); margin-bottom: 16px; }',
    'td { white-space: nowrap;  overflow: hidden; text-overflow: ellipsis; }',
    ` .search {
        display: flex;
        border: solid 1px var(--lighter-nav-bg);
        background-color: transparent;
        align-items: center;
        margin-bottom: 16px;
      }
      div.search > i {
        background-color: white;
        color: var(--nav-background);
        line-height: 31px;
        padding-left: 13px;
      }
      .search > input[type=search] {
        border: none !important;
      }
    `,
    'table { table-layout: fixed }',
    'td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
  ]
})
export class StockRecordSelectionModalComponent implements OnInit, AfterViewInit {
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

  //
  constructor(
    protected fb: FormBuilder,
    protected service: InventoryStockRecordService,
  ) { }

  //
  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get stockRecord(): FormControl { return this.form.get('stockRecord') as FormControl; }

  //
  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.result = DialogResult.Cancelled;

      this.searchTextChanged$ = this.searchText.valueChanges.subscribe(
        (value) => {
          this.onSearchTextChanged(value);
        }
      );
    });

    // ensure that we unsubscribe from valueChanges when this form
    // is closed (prevent memory leaks, as it will be reinitialized later)
    this.modal.onClose.subscribe(() => {
      if (this.searchTextChanged$) {
        this.searchTextChanged$.unsubscribe();
      }
    });

    this.onSearchTextChanged('');
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

  displayReceivingID(href: string): string {
    return getSlugFromHref(href);
  }

  getValue(): FormData {
    if (this.result !== DialogResult.OK) {
      return null;
    }
    return new FormData(this.formView.nativeElement);
  }

  /**
   * Whenever the user changes the search text, reload
   * the currently-displayed products (after a slight delay
   * to ensure they're not still typing; 650ms)
   *
   * @param newValue The new value the user has typed.
   */
  onSearchTextChanged(newValue: string) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (newValue === this.originalValue) {
      return;
    }

    this.timeoutId = setTimeout(() => {
      this.service.fetchListWithFilter(this.searchText.value, 1, 10, this.filters)
        .pipe(map(stockRecords => {
          // show only stock record with original quantity more than 0
          if (this.isInStock) {
            stockRecords.entities = stockRecords.entities.filter(
              entity => entity.originalQuantity > 0
            );
          }
          return stockRecords;
        })).subscribe((page) => {
        this.displayedResults = page;
      });
      }, this.reloadTimeout);
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
