import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { banner } from '@nusantara/models';

@Component({
  selector: 'nus-banner-list',
  template: `
    <nus-list-header
      title="Banners">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Valid From</th>
        <th>Valid To</th>
        <th>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td>{{ entity.validFrom|date }}</td>
        <td>{{ entity.validTo|date }}</td>
        <td><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `
})
export class BannerListComponent extends AbstractListComponent<banner.IBanner> {
  constructor(route: ActivatedRoute) { super(route); }
}
