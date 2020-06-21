import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';

@Component({
  selector: 'nus-shipping-method-list',
  template: `
    <nus-list-header
      title="Shipping Methods"
      description="A way which orders can be fulfilled to the customer.">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }})</a></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [],
})
export class ShippingMethodListComponent extends AbstractListComponent<any> {
  constructor(protected route: ActivatedRoute) { super(); }
}
