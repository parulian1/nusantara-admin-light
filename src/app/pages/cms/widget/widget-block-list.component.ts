import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { widgets } from '@nusantara/models';
import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-widget-list',
  template: `
    <nus-list-header i18n-title
      title="Widgets Blocks"
      description="Blocks in which widgets are displayed">
    </nus-list-header>
    <table>
      <thead>
        <tr>
          <th translate i18n>Name</th>
          <th i18n>Page</th>
          <th i18n>Widgets</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of page.entities">
          <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
          <td>{{ entity.urlPath }}</td> <!-- TODO: if __all__, then show *all* and header/footer -->
          <td>{{ entity.widgets.length }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [ ]
})
export class WidgetBlockListComponent extends AbstractListComponent<widgets.IWidgetBlock> {
  constructor(route: ActivatedRoute) { super(route); }
}
