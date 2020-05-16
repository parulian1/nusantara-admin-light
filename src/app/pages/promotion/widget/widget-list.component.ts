import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWidget } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-widget-list',
  template: `
    <nus-list-header
      title="Widgets"
      description="Widgets are components which are dispalyed">
    </nus-list-header>
    <table>
      <thead>
        <tr>
          <th translate>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class WidgetListComponent extends AbstractListComponent<IWidget> {
  constructor(protected route: ActivatedRoute) { super(); }
}
