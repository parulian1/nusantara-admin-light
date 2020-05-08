import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagedResponse } from '@nusantara/core/pagination';
import { IProductClass } from './product-class.service';

/**
 * Browse a list of Product Classes.
 * Shows links to 'new' and 'edit' an existing product class.
 */
@Component({
  selector: 'nus-product-class-list',
  template: `
    <h1>Product Classes</h1>
    <nav>
      <a [routerLink]="['new']">New</a>
    </nav>
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
  styles: []
})
export class ProductClassListComponent implements OnInit {

  page: PagedResponse<IProductClass>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { page: PagedResponse<IProductClass> }) => {
      this.page = data.page;
    });
  }
}
