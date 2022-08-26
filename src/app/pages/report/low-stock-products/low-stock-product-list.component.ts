import {PagedResponse} from '@nusantara/core';
import {ILowStock, ILowStockProduct} from '@nusantara/models/products';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LowStockProductService} from '@nusantara/services/low-stock-product.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {drf, IWarehouse} from '@nusantara/models';
import {MatSelectChange} from '@angular/material/select';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'nus-low-stock-product-list',
  template: `
    <h1 class="title-1" i18n>Low Stock</h1>
    <form [formGroup]="form" class="fluid">
      <div class="list-page-header">
        <div class="search control">
          <i class="material-icons" i18n>search</i>
          <input type="search" id="search_box" [formControl]="searchText" placeholder="Search Product Name dan UPC"
                 i18n-placeholder>
        </div>
        <div class="filter">
          <span class="subheading-2">Filter</span>
          <mat-form-field>
            <mat-select [disableOptionCentering]="true"
                        panelClass="mat-select-panel"
                        formControlName="warehouse"
                        (selectionChange)="selectChange($event)">
              <mat-option value="" i18n>Select Warehouse</mat-option>
              <mat-option
                *ngFor="let warehouse of warehouses"
                [value]="warehouse.name">
                {{ warehouse.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="action">
          <a class="control secondary" (click)="downloadProductList()" *ngIf="displayedResults?.totalResults > 0"
             i18n>Export</a>
        </div>
      </div>
      <nus-low-stock-product-pagination
        *ngIf="displayedResults?.totalResults > 0"
        [page]="displayedResults"
        [updatedDate]="updatedDate"
        (updatePage)="updatePage($event)">
      </nus-low-stock-product-pagination>
      <table>
        <thead>
        <tr>
          <th class="custom-threshold-star"></th>
          <th i18n>Name</th>
          <th i18n>UPC</th>
          <th i18n>Warehouse</th>
          <th i18n>Location</th>
          <th i18n>Qty</th>
        </tr>
        </thead>
        <tbody *ngIf="displayedResults?.totalResults > 0">
        <tr *ngFor="let entity of displayedResults.entities">
          <td class="custom-threshold-star">
            <span *ngIf="entity.isCustomThreshold"  class="tooltip">
               <i class="material-icons">star</i>
              <span class="text body-2">Custom threshold</span>
            </span>
          </td>
          <td>{{entity.name}}</td>
          <td>{{entity.upc}}</td>
          <td>{{entity.warehouseName}}</td>
          <td>{{entity.sublocationName}} ({{entity.sublocationType | sublocationTypeToLabel }})</td>
          <td>{{entity.latestStock}}</td>
        </tr>
        </tbody>
        <tbody *ngIf="displayedResults?.totalResults === 0">
        <tr>
          <td colspan="6" class="centered">
            <p class="body-1" i18n>No low stock product found</p>
          </td>
        </tr>
        </tbody>
      </table>
      <nus-low-stock-product-pagination
        *ngIf="displayedResults?.totalResults > 0"
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
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .action {
      grid-area: action;
      display: flex; justify-content: center; align-items: center; margin-left: auto;
    }
    .action > a {text-align: center;}

    th:first-child, td:first-child { width: 1%; }

    .custom-threshold-star .material-icons {
      font-size: 18px;
      color: var(--alert);
    }

    /* Tooltip container */
    .tooltip {
      position: relative;
      display: inline-block;
    }

    /* Tooltip text */
    .tooltip .text {
      visibility: hidden;
      min-width: 120px;
      font-weight: 400;
      text-align: left;
      padding: 16px;
      border-radius: 4px;
      background-color: white;

      /* Position the tooltip text */
      position: absolute;
      z-index: 1;
      top: 130%;
      left: -30%;

      /* Fade in tooltip */
      opacity: 0;
      transition: opacity 1s;
      box-shadow: 0 0 8px -1px var(--shadow-color);
    }

    /* Tooltip arrow */
    .tooltip .text::before {
      content: "";
      position: absolute;
      bottom: 100%;
      left: 6%;

      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom-color: white;
      filter: drop-shadow(0 -2px 2px var(--shadow-color));
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .text {
      visibility: visible;
      opacity: 1;
    }
  `]
})

export class LowStockProductListComponent implements OnInit, AfterViewInit {
  warehouses: Array<{ href: string, name: string, code: string }>;
  subLocationTypes: Array<drf.IChoice>;
  updatedDate: string;

  entity: ILowStockProduct;

  form: FormGroup;
  searchTextChanged$: Subscription;

  displayedResults: PagedResponse<ILowStockProduct> = null;
  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  filters = {};

  currentPage = 1;

  constructor(protected service: LowStockProductService,
              protected fb: FormBuilder,
              protected route: ActivatedRoute) {}

  get searchText(): FormControl {
    return this.form.get('searchText') as FormControl;
  }

  get warehouse(): FormControl {
    return this.form.get('warehouse') as FormControl;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: {
      lowStockConfig: ILowStock,
      subLocationTypes: drf.IChoice[],
      allWarehouses: IWarehouse[]
    }) => {
      this.subLocationTypes = data.subLocationTypes;
      this.warehouses = data.allWarehouses;
      this.updatedDate = data.lowStockConfig.productListUpdatedAt;
    });

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
      warehouse: ['', []],
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
