import { Component, OnInit } from '@angular/core';
import {AbstractListComponent} from '@nusantara/core';
import {IWarehouseMapping} from '@nusantara/models/integrations/warehouse-mapping';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'nus-warehouse-mapping-list',
  template: `
    <nus-list-header i18n-title
                     title="Warehouse Mapping to Integration"
                     i18n-description
                     description="Map warehouse sublocation to integration partner ID."
    [canSearch]="false">
    </nus-list-header>
    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
      <tr>
        <th i18n>Type</th>
        <th i18n>SubLocation</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.type }}</a></td>
        <td>{{ entity.location.name }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [
  ]
})
export class WarehouseMappingListComponent extends AbstractListComponent<IWarehouseMapping> {

  constructor(route: ActivatedRoute) { super(route); }

}
