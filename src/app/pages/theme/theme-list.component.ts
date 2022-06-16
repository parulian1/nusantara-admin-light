import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { themes } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';


@Component({
  selector: 'nus-theme-list',
  template: `
    <nus-list-header i18n-title
      title="Themes"
      description="Users that can manage themes."
      [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <!-- <th>ID</th> -->
        <th i18n>Name</th>
        <th i18n>Subsrciption Type</th>
        <th i18n>Status</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <!-- <td>{{ entity.title }}</td> -->
        <td>{{ entity.subscriptionType }}</td>
        <td><nus-true-false [value]="!!entity.isActive" [showFalseIcon]="false"></nus-true-false></td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,

})
export class ThemeListComponent extends AbstractListComponent<themes.ITheme> {
  constructor(route: ActivatedRoute) { super(route); }
}
