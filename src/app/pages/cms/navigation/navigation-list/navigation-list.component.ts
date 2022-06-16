import {Component, OnInit} from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {INavigation} from '@nusantara/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nus-navigation-list',
  template: `
    <nus-list-header i18n-title
      title="Content Header Navigation"
      description="Header Navigation">
    </nus-list-header>

    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
    </div>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Title</th>
        <th class="numeric" i18n>Number of Child</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.title }}</a></td>
        <td class="numeric">{{ entity.children.length }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `
})
export class NavigationListComponent extends AbstractListComponent<INavigation> {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
