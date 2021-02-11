import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { products } from '@nusantara/models';
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
          <td class="centered"><nus-true-false [value]="entity.media.length > 0"></nus-true-false></td>
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
          <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
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
