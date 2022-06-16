import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { products } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core/components/abstract-list.component';

/**
 * Browse a list of Product Classes.
 * Shows links to 'new' and 'edit' an existing product class.
 */
@Component({
  selector: 'nus-product-class-list',
  template: `
    <nus-list-header i18n-title
      title="Product Classes"
      description="Defines 'types' of products which are sold.">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate i18n>Name</th>
          <th translate i18n>Type</th>
          <th translate class="numeric" i18n>Products</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.type }}</td>
          <td class="numeric">{{ entity.productCount }}</td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,

})
export class ProductClassListComponent extends AbstractListComponent<products.IProductClass> {
  constructor(route: ActivatedRoute) { super(route); }
}
