import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {NgxSmartModalComponent} from 'ngx-smart-modal';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogResult, PagedResponse} from '@nusantara/core';
import {Subscription} from 'rxjs';
import {IProductClass} from '@nusantara/models/products';
import {ISubLocation, IWarehouse} from '@nusantara/models';
import {ProductClassService, SubLocationService, WarehouseService} from '@nusantara/services';

@Component({
    selector: 'nus-warehouse-location-modal',
    template: `
      <ngx-smart-modal [identifier]="'selectSubLocation'" #modal [formGroup]="form" [customClass]="'wide-modal'">
        <h2 class="heading-2" i18n>Select Product Class</h2>
        <form #modalForm class="fluid">
          <div class="search">
            <i class="material-icons">search</i>
            <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Class Name">
          </div>
          <input type="hidden" [formControl]="subLocation">
          <p i18n>Search Warehouse name.</p>
          <table>
            <colgroup>
              <col class="product-name">
              <col class="product-sku">
            </colgroup>
            <thead>
            <tr style="background-color: #F4F4F4;">
              <th i18n>Warehouse Name</th>
              <th class="centered" i18n>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let p of displayedResults?.entities">
              <td class="product-name" colspan="2">{{ p.name }}
              <table>
                <tr *ngFor="let subLocation of p.subLocations">
                  <td>{{subLocation.name}}</td>
                  <td class="centered"><a href="#" (click)="selectSubLocation(subLocation)" i18n>Select</a></td>
                </tr>
              </table>
              </td>

            </tr>
            </tbody>
          </table>
        </form>
      </ngx-smart-modal>`
})

export class WarehouseLocationModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalForm') formView: ElementRef<HTMLFormElement>;
  @ViewChild('modal') modal: NgxSmartModalComponent;

  form: FormGroup;
  result: DialogResult = DialogResult.Cancelled;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<IWarehouse> = null;

  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;

  constructor(protected fb: FormBuilder, protected service: WarehouseService) { }

  ngOnInit(): void {
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
      subLocation: ['', [Validators.required, ]],
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

  selectSubLocation(p: ISubLocation) {
    this.subLocation.setValue(p);
    this.close();
    return false;
  }

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }

  get subLocation(): FormControl {
    return this.form.get('subLocation') as FormControl;
  }
}
