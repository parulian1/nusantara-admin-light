import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { ISla } from '@nusantara/models';

@Component({
  selector: 'nus-flat-page-list',
  template: `
    <nus-list-header i18n-title
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
          <th i18n>Title</th>
          <th i18n>Description</th>
          <th class="numeric" i18n>Sort Priority</th>
          <th class="centered" i18n>Is Active</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.title }}</a></td>
          <td>{{ entity.description }}</td>
          <td class="numeric">{{ entity.sortPriority }}</td>
          <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
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
