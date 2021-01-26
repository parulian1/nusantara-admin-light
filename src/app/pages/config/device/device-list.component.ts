import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { device } from '@nusantara/models';

@Component({
  selector: 'nus-device-list',
  template: `
    <nus-list-header
      title="Device"
      description="A device registered information." [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Warehouse</th>
          <th>Device Name</th>
          <th>Is Approved</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity.href|entityToSlug]">{{ entity.warehouse.name }} </a></td>
        <td>{{ entity.data.name }}</td>
        <td><nus-true-false [value]="entity.isApproved"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class DeviceListComponent extends AbstractListComponent<device.IDevice> {
  constructor(route: ActivatedRoute) { super(route); }
}
