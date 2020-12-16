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
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
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
              {{ entity.category.name }}
            </a>
          </td>
          <td>
            <a [routerLink]="['/catalog', 'product-classes', entity.productClass|entityToSlug]">
              {{ entity.productClass.name }}
            </a>
          </td>
          <td>
            <a [routerLink]="['/catalog', 'vendors', entity.vendor|entityToSlug]">
              {{ entity.vendor.name }}
            </a>
          </td>
          <td><nus-true-false [value]="entity.isActive"></nus-true-false></td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: []
})
export class ProductListComponent extends AbstractListComponent<products.IProduct> {

  constructor(route: ActivatedRoute) { super(route); }

}
