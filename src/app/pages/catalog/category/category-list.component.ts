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

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th translatec class="numeric">Depth</th>
          <th translate class="centered">Has Icon?</th>
          <th translate class="numeric">Product Count</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.pathName }}</a></td>
          <td class="numeric">{{entity.depth}}</td>
          <td class="centered"><nus-true-false [value]="!!entity.image" [showFalseIcon]="false"></nus-true-false></td>
          <td class="numeric">{{ entity.productCount }}</td>
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
