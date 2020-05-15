import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductClass } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core/components/abstract-list.component';

/**
 * Browse a list of Product Classes.
 * Shows links to 'new' and 'edit' an existing product class.
 */
@Component({
  selector: 'nus-product-class-list',
  template: `
    <nus-list-header
      title="Product Classes"
      description="Defines 'types' of products which are sold.">
    </nus-list-header>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th translate>Type</th>
          <th translate>Products</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.type }}</td>
          <td>???</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class ProductClassListComponent extends AbstractListComponent<IProductClass> {
  constructor(protected route: ActivatedRoute) { super(); }
}
