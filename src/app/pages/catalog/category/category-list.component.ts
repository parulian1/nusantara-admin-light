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

    <table>
      <thead>
        <tr>
          <th translate>Name</th>
          <th translate>Depth</th>
          <th translate>Icon</th>
          <th translate>Product Count</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.pathName }}</a></td>
          <td>{{entity.depth}}</td>
          <td>
            <img [src]="entity.image" alt="icon" class="icon" *ngIf="entity.image">
            <span *ngIf="!entity.image">---</span>
          </td>
          <td>{{ entity.productCount }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    'img.icon { background-color: gray; height: 16px; width: 16px; }',
  ]
})
export class CategoryListComponent extends AbstractListComponent<ICategory> {
  constructor(protected route: ActivatedRoute) { super(); }
}
