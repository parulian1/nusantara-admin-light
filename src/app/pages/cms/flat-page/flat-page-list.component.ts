import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IFlatPage } from '@nusantara/models';

@Component({
  selector: 'nus-flat-page-list',
  template: `
    <nus-list-header i18n-title
      title="Pages"
      description="Static content for pages such as 'About-Us'">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th i18n>Name</th>
          <th i18n>URL Path</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.title }}</a></td>
        <td>{{ entity.url }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `
})
export class FlatPageListComponent extends AbstractListComponent<IFlatPage> {
  constructor(route: ActivatedRoute) { super(route); }
}
