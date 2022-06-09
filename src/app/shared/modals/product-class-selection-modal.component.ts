import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogResult, PagedResponse} from '@nusantara/core';
import {Subscription} from 'rxjs';
import {CategoryService, ProductClassService} from '@nusantara/services';
import {IProductClass} from '@nusantara/models/products';

@Component({
  selector: 'nus-product-class-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectProductClass'" #modal [formGroup]="form" [customClass]="'wide-modal'">
      <h2 class="heading-2" i18n>Select Product Class</h2>
      <form #modalForm class="fluid">
        <div class="search">
          <i class="material-icons">search</i>
          <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Class Name">
        </div>
        <input type="hidden" [formControl]="productClass">
        <p i18n>Search product class name to find more product classes.</p>
        <table>
          <colgroup>
            <col class="product-name">
            <col class="product-sku">
          </colgroup>
          <thead>
          <tr style="background-color: #F4F4F4;">
            <th i18n>Product Class Name</th>
            <th class="centered" i18n>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let p of displayedResults?.entities">
            <td class="product-name">{{ p.name }}</td>
            <td class="centered"><a href="#" (click)="selectProductClass(p)" i18n>Select</a></td>
          </tr>
          </tbody>
        </table>
      </form>
    </ngx-smart-modal>`,
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
    '.product-name { width: 50%; }',
    '.product-sku { width: 30%; }'
  ]
})
export class ProductClassSelectionModalComponent implements OnInit, AfterViewInit {

  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  @Output() productClassChanged?: EventEmitter<void> = new EventEmitter<void>();

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<IProductClass> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;


  constructor(protected fb: FormBuilder, protected service: ProductClassService) { }

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }
  get productClass(): FormControl { return this.form.get('productClass') as FormControl; }

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
      productClass: ['', [Validators.required, ]],
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

  selectProductClass(productClass: IProductClass) {
    this.productClass.setValue(productClass);
    this.close();
    if (!!this.productClassChanged) {
      this.productClassChanged.emit();
    }
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
