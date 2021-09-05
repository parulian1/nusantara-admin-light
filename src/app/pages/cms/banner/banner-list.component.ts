import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { banner } from '@nusantara/models';

@Component({
  selector: 'nus-banner-list',
  template: `
    <nus-list-header
      title="Banners" i18n-title>
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Name</th>
        <th i18n>Type</th>
        <th class="numeric" i18n>Valid From</th>
        <th class="numeric" i18n>Valid To</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td class="numeric">{{ entity.validFrom|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
        <td class="numeric">{{ entity.validTo|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `
})
export class BannerListComponent extends AbstractListComponent<banner.IBanner> {
  constructor(route: ActivatedRoute) { super(route); }
}
