import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { ICategory } from '@nusantara/models';

@Component({
  selector: 'nus-category-list',
  template: `
    <nus-list-header
      title="Categories"
      description="Groups related products together, so customers
                   can discover something-something">
    </nus-list-header>
    <div class="filtering">
      <!-- Soft deleted product but change the wording into InActive -->
      <nus-include-deleted text="Show Inactive Category"></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate i18n>Name</th>
          <th translate class="numeric" i18n>Depth</th>
          <th translate class="centered" i18n>Has Icon?</th>
          <th translate class="numeric" i18n>Product Count</th>
          <th class="centered" i18n>Is Active</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.pathName }}</a></td>
          <td class="numeric">{{entity.depth}}</td>
          <td class="centered"><nus-true-false [value]="!!entity.image" [showFalseIcon]="false"></nus-true-false></td>
          <td class="numeric">{{ entity.productCount }}</td>
          <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>

        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [
    'img.icon { background-color: gray; height: 16px; width: 16px; }',
  ]
})
export class CategoryListComponent extends AbstractListComponent<ICategory> {
  constructor(route: ActivatedRoute) { super(route); }
}
