import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { device } from '@nusantara/models';

@Component({
  selector: 'nus-device-list',
  template: `
    <nus-list-header i18n-title
      title="Device"
      description="A device registered information." [canAddNew]="false">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th i18n>Warehouse</th>
          <th i18n>Device Name</th>
          <th i18n>Register Data</th>
          <th i18n>Last Login</th>
          <th class="centered" i18n>Is Approved</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity.href|entityToSlug]">{{ entity.warehouse.name }} </a></td>
        <td>{{ entity.data.name }}</td>
        <td>{{ entity.created|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
        <td>{{ entity.data.lastLogin? (entity.data.lastLogin |date: 'dd/MM/yyyy HH:mm:ss') : '-' }}</td>
        <td class="centered"><nus-true-false [value]="entity.isApproved"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class DeviceListComponent extends AbstractListComponent<device.IDevice> {
  constructor(route: ActivatedRoute) { super(route); }
}
