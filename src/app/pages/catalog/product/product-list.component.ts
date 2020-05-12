import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagedResponse } from '@nusantara/core/pagination';
import { IProduct } from '@nusantara/models';

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
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class ProductListComponent implements OnInit {

  page: PagedResponse<IProduct>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: { page: PagedResponse<IProduct> }) => {
      this.page = data.page;
    });
  }
}
