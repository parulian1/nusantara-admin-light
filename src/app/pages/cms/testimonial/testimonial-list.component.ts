import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { widgets } from '@nusantara/models';

@Component({
  selector: 'nus-flat-page-list',
  template: `
    <nus-list-header
      title="Testimonials"
      description="Customer reviews of Products/Vendors">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Vendor/Product</th>
          <th>Reviewer Name</th>
          <th class="centered">Is Active</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.vendor?.name || entity.product?.name }}</td>
        <td>{{ entity.reviewerName }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [],
})
export class TestimonialListComponent extends AbstractListComponent<widgets.ITestimonial> {
  constructor(route: ActivatedRoute) { super(route); }
}
