import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagedResponse } from '@nusantara/core/pagination';
import { ICategory, IVendor, products } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

/**
 * A searchable list of all products.
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-product-list',
  template: `
    <nus-list-header
      title="Products">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th>UPC</th>
          <th>Variants</th>
          <th>Has Image</th>
          <th>Category</th>
          <th>Product Class</th>
          <th>Vendor</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.upc }}</td>
          <td><span *ngIf="entity.variants.length">{{ entity.variants.length }}</span></td>
          <td><nus-true-false [value]="entity.media.length > 0"></nus-true-false></td>
          <td>
            <a [routerLink]="['/catalog', 'categories', entity.category|entityToSlug]">
              {{ getCategoryName(entity.category) }}
            </a>
          </td>
          <td>
            <a [routerLink]="['/catalog', 'product-classes', entity.productClass|entityToSlug]">
              {{ getProductClassName(entity.productClass) }}
            </a>
          </td>
          <td>
            <a [routerLink]="['/catalog', 'vendors', entity.vendor|entityToSlug]">
              {{ getVendorName(entity.vendor) }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class ProductListComponent extends AbstractListComponent<products.IProduct> {

  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  productClasses: Array<products.IProductClass>;

  constructor(route: ActivatedRoute) { super(route); }

  getCategoryName(href: string): string {
    return this.categories.filter(e => e.href === href)[0]?.name;
  }

  getVendorName(href: string): string {
    return this.vendors.filter(e => e.href === href)[0]?.name;
  }

  getProductClassName(href: string): string {
    return this.productClasses.filter(e => e.href === href)[0]?.name;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {
    this.route.data.subscribe(
      (data: {
          categories: ICategory[],
          vendors: PagedResponse<IVendor>,
          productClasses: products.IProductClass[]}) => {
        this.categories = data.categories;
        this.vendors = data.vendors.entities;
        this.productClasses = data.productClasses;
    });
    super.ngOnInit();
  }
}
