import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IPaymentGateway } from '@nusantara/models';

@Component({
  selector: 'nus-payment-gateway-list',
  template: `
    <nus-list-header i18n-title
      title="Payment Gateway"
      description="A processor that accepts and processes payments;  May have one or more payment channels.">
    </nus-list-header>

    <nus-pagination [page]="page"></nus-pagination>

    <table>
      <thead>
        <tr>
          <th i18n>Name</th>
          <th i18n>Type</th>
        </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
      </tr>
      </tbody>
    </table>

    <nus-pagination [page]="page"></nus-pagination>
  `,
  styles: [],
})
export class PaymentGatewayListComponent extends AbstractListComponent<IPaymentGateway> {
  constructor(route: ActivatedRoute) { super(route); }
}
