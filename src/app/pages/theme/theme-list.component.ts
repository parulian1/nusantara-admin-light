import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { themes } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';


@Component({
  selector: 'nus-theme-list',
  template: `
    <nus-list-header
      title="Themes"
      description="Users that can manage themes."
      [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <!-- <th>ID</th> -->
        <th>Name</th>
        <th>Subsrciption Type</th>
        <th>Status</th>
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
  styles: [``]
})
export class ThemeListComponent extends AbstractListComponent<themes.ITheme> {
  constructor(route: ActivatedRoute) { super(route); }
}
