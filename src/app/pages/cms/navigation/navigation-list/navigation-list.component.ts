import {Component, OnInit} from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {INavigation} from '@nusantara/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nus-navigation-list',
  template: `
    <nus-list-header
      title="Content Header Navigation"
      description="Header Navigation">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th>Title</th>
        <th class="numeric">Number of Child</th>
        <th class="centered">Is Active</th>
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
  `,
  styles: [``],
})
export class NavigationListComponent extends AbstractListComponent<INavigation> {

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
