import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { drf, products } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';
import { FormControl } from '@angular/forms';
import { WarehouseService } from '@nusantara/services';

/**
 * A searchable list of all products.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-product-list',
  template: `
    <!--    <nus-list-header-->
    <!--      title="Products">-->
    <!--    </nus-list-header>-->

    <header>
      <h1 class="title-1" i18n>Products</h1>
      <div class="top-action">
        <div class="left-menu">
          <div class="search control">
            <i class="material-icons">search</i>
            <input type="search" placeholder="Search" [formControl]="queryText">
          </div>

          <div class="filter-control" *ngIf="!!showBundling">
            <select [formControl]="productType">
              <option *ngFor="let opt of productTypeChoices" [ngValue]="opt.value">
                {{opt.displayName}}
              </option>
            </select>
          </div>
        </div>
        <ng-container *ngIf="!showBundling; else bundlingAddComponent;">
          <div  class="add-product control">
            <a [routerLink]="['new']" class="control"><i class="material-icons">add</i> Add</a>
          </div>
        </ng-container>
        <ng-template #bundlingAddComponent>
          <div *ngIf="!!showBundling" class="add-product control" (nusClickOutside)="close()">
            <a [routerLink]="['new']"> Add</a>
            <span class="material-icons" (click)="addBundleProduct()">expand_more</span>
            <div class="add-bundle-product"
                 *ngIf="isBundling"><a [routerLink]="['new','bundling']" i18n>Bundling Product</a>
            </div>
          </div>
        </ng-template>

      </div>
    </header>


    <div class="filtering">
      <!-- Soft deleted product but change the wording into InActive -->
      <nus-include-deleted text="Show Inactive Product" i18n-text></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate i18n>Name</th>
          <th i18n>UPC</th>
          <th class="numeric" i18n>Variants</th>
          <th class="centered" i18n>Has Image</th>
          <th i18n>Category</th>
          <th i18n>Product Class</th>
          <th i18n>Vendor</th>
          <th class="centered" i18n>Is Active</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.upc }}</td>
        <td class="numeric"><span *ngIf="entity.variants.length">{{ entity.variants.length }}</span></td>
        <td class="centered">
          <nus-true-false [value]="entity.media.length > 0"></nus-true-false>
        </td>
        <td>
          <a [routerLink]="['/catalog', 'categories', entity.category|entityToSlug]">
            {{ entity.category.name }}
          </a>
        </td>
        <td>
          <a [routerLink]="['/catalog', 'product-classes', entity.productClass|entityToSlug]">
            {{ entity.productClass.name }}
          </a>
        </td>
        <td>
          <a *ngIf="entity?.vendor?.name" [routerLink]="['/catalog', 'vendors', entity.vendor|entityToSlug]">
            {{ entity?.vendor?.name }}
          </a>
        </td>
        <td class="centered">
          <nus-true-false [value]="entity.isActive"></nus-true-false>
        </td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: ['header { margin-bottom: 23px; }',
    'header > div { display: flex; }',
    'input[type=search] { font-size: 15px; padding-right: 5px; width: 325px; }',
    'a { justify-content: center; align-items: center; margin-left: auto; }',
    'p { margin-bottom: 5px; }',

    `
      a > i {
        line-height: 31px;
        font-size: 20px;
      }

      .search {
        display: flex;
        border: solid 1px var(--grey);
        background-color: transparent;
        align-items: center
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

      .left-menu {
        display: flex;
        flex-direction: row;
      }

      .left-menu .filter-control {
        margin-left: 24px;
      }

      .left-menu .filter-control select {
        height: 42px;
      }

      .top-action {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .add-product {
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 120px;
        position: relative;
      }

      .add-product a {
        padding: 0 16px;
        margin: 0;
        text-decoration: none;
        color: #fff;
      }

      .add-product span {
        border-left: 1px solid #fff;
        padding-left: 4px;
        cursor: pointer;
      }

      .add-bundle-product {
        position: absolute;
        top: 40px;
        right: 0px;
        color: black;
        border-radius: 4px;
        padding: 8px;
        min-width: 160px;
        box-shadow: 0px 4px 8px rgb(0 0 0 / 16%), 0px -2px 6px rgb(0 0 0 / 8%);
        font-weight: 400;
      }

      .add-bundle-product a {
        text-decoration: none;
        color: #000;
      }

      table {
        text-align: left;
      }
      td {
        text-align: left;
      }
    `]
})
export class ProductListComponent extends AbstractListComponent<products.IProduct> {

  isBundling = false;
  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  queryText = new FormControl('');
  productType = new FormControl('');
  showBundling = false;
  productTypeChoices: drf.IChoice[] = [
    {displayName: 'All', value: 'all'},
    {displayName: 'Single Product', value: 'single'},
    {displayName: 'Bundle Product', value: 'bundling'}
  ];

  constructor(route: ActivatedRoute, public router: Router, private warehouseService: WarehouseService) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParamMap.subscribe(
      (value) => {
        this.queryText.setValue(value.get('q'));
        this.originalValue = value.get('q');
        this.queryText.valueChanges.subscribe(
          (newValue) => { this.onQueryTextChanged(newValue); }
        );
        let _productType = value.get('product_type');
        if (!_productType) {
          _productType = 'all';
        }
        this.productType.setValue(_productType);
        this.productType.valueChanges.subscribe((newValue) => this.applyProductTypeFilter(newValue));
      }
    );
    this.warehouseService.fetchHeadWarehouse().subscribe((resp) => {
      if (resp.totalResults === 1) {
        this.showBundling = true;
      }
    })
  }

  onQueryTextChanged(newValue: string) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // don't run if the value hasn't actually changed from the original.
    if (newValue === this.originalValue) {
      return;
    }

  // always go back to page 1 when a new filter is applied
    this.timeoutId = setTimeout(() => {
      // wait to see if the user is still typing more before navigating
      const params = {q: this.queryText.value, page: 1};
      this.router.navigate(
        ['.'],
        {
          queryParams: params,
          queryParamsHandling: 'merge',
          relativeTo: this.route
        }
      );
    }, this.reloadTimeout);
  }

  addBundleProduct(): void {
    this.isBundling = !this.isBundling;
  }

  close(): void {
    if (this.isBundling === true) {
      this.isBundling = false;
    }
  }

  applyProductTypeFilter(event: string) {
    const params = {product_type: event};
    this.router.navigate(
      ['./'],
      {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this.route
      }).catch((error) => {
        if (error.status === 404) {
          this.router.navigate(
          ['./'],
          {
            queryParams: {product_type: event, page: 1},
            queryParamsHandling: 'merge',
            relativeTo: this.route
          });
        }
    });
  }
}
