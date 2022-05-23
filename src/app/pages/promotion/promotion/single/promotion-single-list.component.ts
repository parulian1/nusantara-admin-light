import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IProductPromotion } from '@nusantara/models';

@Component({
  selector: 'nus-promotion-single-list',
  template: `
    <h1 class="title-1">Promotion</h1>
    <div class="tab">
      <div (click)="goToPromoCampaign()">
        <strong>Campaign</strong>
      </div>
      <div [class.active]="true">
        <strong>Single</strong>
      </div>
    </div>
    <nus-list-header i18n-title
      title="Promos" [showTitle]="false">
    </nus-list-header>
    <div class="filtering">
      <nus-include-deleted></nus-include-deleted>
      <nus-include-inactive></nus-include-inactive>
    </div>
    <nus-pagination [page]="page"></nus-pagination>
    <table>
      <thead>
      <tr>
        <th translate i18n>Name</th>
        <th i18n>Type</th>
        <th class="numeric" i18n>Amount</th>
        <th class="numeric" i18n>Valid From</th>
        <th class="numeric" i18n>Valid To</th>
        <th class="numeric" i18n>Priority</th>
        <th class="centered" i18n>Is Active</th>
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
  styles: [
    `
    .tab {
      overflow: hidden;
      display: flex;
      justify-content: start;
      border-bottom: 1px solid var(--grey);
      margin-bottom: 24px;
    }

    .tab div {
      outline: none;
      cursor: pointer;
      padding: 12px 50px;
      transition: 0.3s;
    }

    .tab div:hover {
      background: var(--darken-white);
    }

    .tab div.active {
      border-bottom: 2px solid var(--secondary);
    }

    .tab.wide { justify-content: center; }

    .tab.wide div { flex-grow: 1; }
    `
  ]
})
export class PromotionSingleListComponent extends AbstractListComponent<IProductPromotion> {
  constructor(route: ActivatedRoute, private router: Router) { super(route); }

  goToPromoCampaign() {
    this.router.navigate(['/promotion/promo/campaign']);
  }
}
