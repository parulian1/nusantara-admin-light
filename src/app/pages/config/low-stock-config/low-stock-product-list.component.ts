import {PagedResponse} from '@nusantara/core';
import {ILowStockProduct} from '@nusantara/models/products';
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {LowStockProductService} from '@nusantara/services/low-stock-product.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {drf} from '@nusantara/models';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'nus-low-stock-product-list',
  template: `
    <form [formGroup]="form" class="fluid">
      <div class="list-page-header">
        <div class="search control">
          <i class="material-icons" i18n>search</i>
          <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Name or SKU">
        </div>
        <div class="filter">
          <mat-form-field>
            <mat-select [disableOptionCentering]="true"
                        panelClass="mat-select-panel"
                        formControlName="warehouse"
                        (selectionChange)="selectChange($event)">
              <mat-option value="null" i18n>Select Warehouse</mat-option>
              <mat-option
                *ngFor="let warehouse of warehouses"
                [value]="warehouse.name">
                {{ warehouse.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="action">
          <a class="control secondary" (click)="downloadProductList()" i18n>Export</a>
        </div>
      </div>
      <nus-low-stock-product-pagination
        *ngIf="displayedResults"
        [page]="displayedResults"
        (updatePage)="updatePage($event)">
      </nus-low-stock-product-pagination>
      <table>
        <thead>
        <tr>
          <th i18n>Name</th>
          <th i18n>Warehouse</th>
          <th i18n>Location</th>
          <th i18n>Qty</th>
        </tr>
        </thead>
        <tbody *ngIf="displayedResults?.totalResults > 0">
        <tr *ngFor="let entity of displayedResults.entities">
          <td>{{entity.name}}</td>
          <td>{{entity.warehouseName}}</td>
          <td>{{entity.sublocationName}} ({{entity.sublocationType}})</td>
          <td>{{entity.latestStock}}</td>
        </tr>
        </tbody>
        <tbody *ngIf="displayedResults?.totalResults == 0">
        <tr>
          <td colspan="4" class="centered">
            <p class="body-1" i18n>No low stock product found</p>
          </td>
        </tr>
        </tbody>
      </table>
      <nus-low-stock-product-pagination
        *ngIf="displayedResults"
        [page]="displayedResults"
        (updatePage)="updatePage($event)">
      </nus-low-stock-product-pagination>
    </form>
  `,
  styles: [`
    .list-page-header {
      margin-top: 24px;
      margin-bottom: 25px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-gap: 16px;
      grid-template-areas:"search filter . action";
    }
    .search {
      display: flex;
      border: solid 1px var(--grey);
      background-color: transparent;
      align-items: center;
      grid-area: search;
      margin: 0.25em 0;
    }
    .search > i {
      background-color: white;
      color: var(--nav-background);
      padding-left: 13px;
      font-size: 20px;
    }
    .search > input[type=search] {
      font-size: 14px;
      padding: 0 0 0 5px;
      border: none !important;
      height: 38px;
    }
    .filter {
        grid-area: filter;
    }
    .action {
      grid-area: action;
      display: flex; justify-content: center; align-items: center; margin-left: auto;
    }
    .action > a {text-align: center;}
  `]
})

export class LowStockProductListComponent implements OnInit, AfterViewInit {
  @Input() warehouses: Array<{ href: string, name: string, code: string }>;
  @Input() subLocationTypes: Array<drf.IChoice>;

  entity: ILowStockProduct;

  form: FormGroup;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<ILowStockProduct> = null;
  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  filters = {};

  currentPage = 1;

  constructor(protected service: LowStockProductService, protected fb: FormBuilder) {
  }

  get searchText(): FormControl {
    return this.form.get('searchText') as FormControl;
  }

  get warehouse(): FormControl {
    return this.form.get('warehouse') as FormControl;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchProduct();
  }

  ngAfterViewInit(): void {
    this.searchTextChanged$ = this.searchText.valueChanges.subscribe(
      (value) => {
        this.onSearchTextChanged(value);
      }
    );
  }

  /**
   * Sets the modals form to a new empty set of data.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      searchText: ['', []],
      warehouse: ['null', []],
    });
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
      this.currentPage = 1;
      this.fetchProduct();
    }, this.reloadTimeout);
  }

  selectChange($event: MatSelectChange) {
    this.currentPage = 1;
    if (!!$event.value && $event.value !== '') {
      this.filters = {warehouse: $event.value};
    } else {
      this.filters = {};
    }
    this.fetchProduct();
  }

  fetchProduct() {
    this.service.fetchListWithFilter(this.searchText.value, this.currentPage, 10, this.filters).pipe(map(results => {
      return results;
    })).subscribe((page) => {
      this.displayedResults = page;
    });
  }

  updatePage(page) {
    this.currentPage = page;
    this.fetchProduct();
  }

  downloadProductList(){
    let tempFilter = {};
    if (this.searchText.value) {
      tempFilter = {
        product: this.searchText.value
      };
    }

    const filterList = {...tempFilter, ...this.filters};

    this.service.downloadProductList(filterList).subscribe((response: string) => {
      this.service.downloadAsCsv(response);
    });
  }
}
