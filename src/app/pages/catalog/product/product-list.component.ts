import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {products} from '@nusantara/models';
import {AbstractListComponent} from '@nusantara/core';
import {FormControl} from "@angular/forms";

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
      <h1 class="title-1">Products</h1>
      <div class="top-action">
        <div class="left-menu">
          <div class="search control">
            <i class="material-icons">search</i>
            <input type="search" placeholder="Search" [formControl]="queryText">
          </div>

          <div class="filter-control">
            <select>
              <option>All</option>
              <option>Single Product</option>
              <option>Bundling Product</option>
            </select>
          </div>
        </div>
        <div class="add-product control" (nusClickOutside)="close()">
          <a [routerLink]="['new']"> Add</a>
          <span class="material-icons" (click)="addBundleProduct()">expand_more</span>
          <div class="add-bundle-product"
               *ngIf="isBundling"><a [routerLink]="['new','bundling']">Bundling Product</a>
          </div>
        </div>
      </div>
    </header>


    <div class="filtering">
      <!-- Soft deleted product but change the wording into InActive -->
      <nus-include-deleted text="Show Inactive Product"></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th translate>Name</th>
        <th>UPC</th>
        <th class="numeric">Variants</th>
        <th class="centered">Has Image</th>
        <th>Category</th>
        <th>Product Class</th>
        <th>Vendor</th>
        <th class="centered">Is Active</th>
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
    'a { display: flex; justify-content: center; align-items: center; margin-left: auto; }',
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
    `]
})
export class ProductListComponent extends AbstractListComponent<products.IProduct> {

  isBundling = false;
  timeoutId: any;
  reloadTimeout = 650;
  originalValue: string = null;
  queryText = new FormControl('');

  constructor(route: ActivatedRoute, public router: Router) {
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
      }
    );
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
    if (!newValue) {
      // if the search input was cleared -> navigate immediately
      this.router.navigate(['.'], {relativeTo: this.route});
    } else {
      this.timeoutId = setTimeout(() => {
        // wait to see if the user is still typing more before navigating
        const params = {q: this.queryText.value};
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
  }

  addBundleProduct(): void {
    this.isBundling = !this.isBundling;
  }

  close(): void {
    if (this.isBundling === true) {
      this.isBundling = false;
    }
  }
}
