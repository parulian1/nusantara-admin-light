import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IHighlight } from '@nusantara/models';

@Component({
  selector: 'nus-highlight-list',
  template: `
    <nus-list-header
      title="Highlights"
      description="Highlight Products with or without brand">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Vendor</th>
        <th>Is Show Homepage</th>
        <th>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.forVendor?.name}}</td>
        <td>
          <nus-true-false [value]="entity.isShowHomepage"></nus-true-false>
        </td>
        <td>
          <nus-true-false [value]="entity.isActive"></nus-true-false>
        </td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [],
})
export class HighlightListComponent extends AbstractListComponent<IHighlight> {
  constructor(route: ActivatedRoute) {
    super(route);
  }
}
