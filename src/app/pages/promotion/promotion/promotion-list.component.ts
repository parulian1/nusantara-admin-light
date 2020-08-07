import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models/products';

@Component({
  selector: 'nus-promotion-list',
  template: `
    <nus-list-header
      title="Promotions">
    </nus-list-header>
    <table>
      <thead>
      <tr>
        <th translate>Name</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Valid From</th>
        <th>Valid To</th>
        <th>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td>
          <span *ngIf="entity.type !== 'percentage'">Rp</span>
          {{ entity.amount }}
          <span *ngIf="entity.type === 'percentage'">%</span>
        </td>
        <td>{{ entity.validFrom|date }}</td>
        <td><span *ngIf="!!entity.validTo">{{ entity.validTo|date }}</span></td>
        <td><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: []
})
export class PromotionListComponent extends AbstractListComponent<IProductPromotion> {
  constructor(route: ActivatedRoute) { super(route); }
}
