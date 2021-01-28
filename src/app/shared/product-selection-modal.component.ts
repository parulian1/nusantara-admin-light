import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '../core';
import { ProductService } from '../services';
import { products } from '../models';

/**
 * Shows the user a list of products they can select from.
 *
 * Note: Currently this does not allow the user to navigate
 * paginated data -- it assumes they're going to be searching
 * mostly based on SKUs.
 */
@Component({
  selector: 'nus-product-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectProduct'" #modal [formGroup]="form" [customClass]="'wide-modal'">
      <h2 class="heading-2">Select Product</h2>
      <form #modalForm class="fluid">
        <div class="search">
          <i class="material-icons">search</i>
          <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Name or SKU">
        </div>
        <input type="hidden" [formControl]="product">
        <p>Showing 10 recently added products. Search product name or SKU to find more products.</p>
        <table>
          <thead>
          <tr style="background-color: #F4F4F4;">
            <th>Product Name</th>
            <th>SKU</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let p of displayedResults?.entities">
            <td>{{ p.name }}</td>
            <td>{{ p.upc }}</td>
            <td><a href="#" (click)="selectProduct(p)">Add</a></td>
          </tr>
          </tbody>
        </table>
      </form>
    </ngx-smart-modal>
  `,
  styles: [
    'h2 { padding-bottom: 16px }',
    'p { color : var(--darken-grey-color); margin-bottom: 16px; }',
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
  ]
})
export class ProductSelectionModalComponent implements OnInit, AfterViewInit {

  @ViewChild('imageInput') imageInput: ElementRef;
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<products.IProduct> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;

  constructor(protected fb: FormBuilder, protected service: ProductService) { }

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get product(): FormControl { return this.form.get('product') as FormControl; }

  ngOnInit() {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    this.modal.onOpen.subscribe(() => {
      this.initializeForm();
      this.result = DialogResult.Cancelled;

      this.searchTextChanged$ = this.searchText.valueChanges.subscribe(
        (value) => { this.onSearchTextChanged(value); }
        );
    });


    // ensure that we unsubscribe from valueChanges when this form
    // is closed (prevent memory leaks, as it will be reinitialized later)
    this.modal.onClose.subscribe(() => {
      if (this.searchTextChanged$) {
        this.searchTextChanged$.unsubscribe();
      }
    });

    // trigger initial loading of products
    this.onSearchTextChanged('');
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      searchText: ['', [ ]],
      product: ['', [Validators.required, ]],
    });
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

    // don't run if the value hasn't actually changed from the original.
    if (newValue === this.originalValue) {
      return;
    }

    // wait to see if the user is still typing, before we reload
    this.timeoutId = setTimeout(() => {
      this.service.fetchList(this.searchText.value, 1, 10).subscribe((page) => {
        this.displayedResults = page;
      });
    }, this.reloadTimeout);

  }

  open() {
    this.modal.open();
  }

  selectProduct(product: products.IProduct) {
    this.product.setValue(product);
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
