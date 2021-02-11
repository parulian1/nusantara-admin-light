import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models';

@Component({
  selector: 'nus-promotion-list',
  template: `
    <nus-list-header
      title="Promotions">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
      <nus-include-inactive></nus-include-inactive>
    </div>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
      <tr>
        <th translate>Name</th>
        <th>Type</th>
        <th class="numeric">Amount</th>
        <th class="numeric">Valid From</th>
        <th class="numeric">Valid To</th>
        <th class="numeric">Priority</th>
        <th class="centered">Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ entity.type }}</td>
        <td class="numeric">
          <span *ngIf="entity.type !== 'percentage'">Rp</span>
          {{ entity.amount }}
          <span *ngIf="entity.type === 'percentage'">%</span>
        </td>
        <td class="numeric">{{ entity.validFrom|date: 'dd/MM/yyyy HH:mm:ss' }}</td>
        <td class="numeric"><span *ngIf="!!entity.validTo">{{ entity.validTo|date: 'dd/MM/yyyy HH:mm:ss' }}</span></td>
        <td class="numeric">{{ entity.priority }}</td>
        <td class="centered"><nus-true-false [value]="entity.isActive"></nus-true-false></td>
      </tr>
      </tbody>
    </table>
    <nus-pagination [page]="page"></nus-pagination>

  `,
  styles: []
})
export class PromotionListComponent extends AbstractListComponent<IProductPromotion> {
  constructor(route: ActivatedRoute) { super(route); }
}
