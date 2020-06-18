import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagedResponse } from '@nusantara/core/pagination';
import { ICategory, IProduct, IProductClass, IVendor } from '@nusantara/models';
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

    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th>UPC</th>
          <th>Category</th>
          <th>Product Class</th>
          <th>Vendor</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.upc }}</td>
          <td>{{ getCategoryName(entity.category) }}</td>
          <td>{{ getProductClassName(entity.productClass) }}</td>
          <td>{{ getVendorName(entity.vendor) }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class ProductListComponent extends AbstractListComponent<IProduct> {

  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  productClasses: Array<IProductClass>;

  constructor(protected route: ActivatedRoute) { super(); }

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
          categories: PagedResponse<ICategory>,
          vendors: PagedResponse<IVendor>,
          productClasses: PagedResponse<IProductClass>}) => {
        this.categories = data.categories.entities;
        this.vendors = data.vendors.entities;
        this.productClasses = data.productClasses.entities;
    });
    super.ngOnInit();
  }
}
