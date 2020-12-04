import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { ISla } from '@nusantara/models';

@Component({
  selector: 'nus-flat-page-list',
  template: `
    <nus-list-header
      title="SLA"
      description="Service Level Agreement">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Sort Priority</th>
          <th>Is Active</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.title }}</a></td>
          <td>{{ entity.description }}</td>
          <td>{{ entity.sortPriority }}</td>
          <td><nus-true-false [value]="entity.isActive"></nus-true-false></td>
        </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [],
})
export class SlaListComponent extends AbstractListComponent<ISla> {
  constructor(route: ActivatedRoute) { super(route); }
}
