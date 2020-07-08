import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalComponent } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';

import { DialogResult, PagedResponse } from '@nusantara/core';
import { ProductService } from '@nusantara/services';
import { products } from '@nusantara/models';

@Component({
  selector: 'nus-product-selection-modal',
  template: `
    <ngx-smart-modal [identifier]="'selectProduct'" #modal [formGroup]="form">
      <h1>Select Product</h1>
      <form #modalForm>
        <input type="search" [formControl]="searchText">
        <input type="hidden" [formControl]="product">

        <div>
          <table>
            <tbody>
            <tr *ngFor="let p of displayedResults?.entities">
              <td><a href="#" (click)="selectProduct(p)">{{ p.name }} ({{ p.upc }})</a></td>
            </tr>
            </tbody>
          </table>
        </div>

        <div>
          <button (click)="cancel()" type="button">Cancel</button>
        </div>
      </form>
    </ngx-smart-modal>
  `,
  styles: [ ]
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
      this.service.fetchList(this.searchText.value).subscribe(
        (page) => {
          console.log('Got this page back', page);
          this.displayedResults = page;
        }
      );
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



