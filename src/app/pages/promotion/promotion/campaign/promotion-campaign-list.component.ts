import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractListComponent } from '@nusantara/core';
import { IPromoGroup } from '@nusantara/models';

@Component({
  selector: 'nus-promotion-campaign-list',
  template: `
    <h1 class="title-1">Promotion</h1>
    <div class="tab">
      <div [class.active]="true">
        <strong>Campaign</strong>
      </div>
      <div (click)="goToPromoSingle()">
        <strong>Single</strong>
      </div>
    </div>
    <nus-list-header i18n-title
      title="Promotion" [showTitle]="false">
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
        <th class="numeric" i18n>Valid From</th>
        <th class="numeric" i18n>Valid To</th>
        <th class="numeric" i18n>Combination Promo</th>
        <th class="numeric" i18n>Priority</th>
        <th class="centered" i18n>Is Active</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let entity of page.entities">
        <td><a [routerLink]="[entity|entityToSlug]">{{ entity.name }}</a></td>
        <td>{{ getValidFrom(entity) }}</td>
        <td>{{ getValidTo(entity) }}</td>
        <td class="numeric">{{ !!entity?.combinations ? entity?.combinations.length: 0 }}</td>
        <td class="numeric">{{ entity.priority }}</td>
        <td class="centered">
          <nus-true-false [value]="entity.isActive"></nus-true-false>
        </td>
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
export class PromotionCampaignListComponent extends AbstractListComponent<IPromoGroup> {
  constructor(route: ActivatedRoute, private router: Router) { super(route); }

  goToPromoSingle() {
    this.router.navigate(['/promotion/promo/single']);
  }

  getValidFrom(entity: IPromoGroup): string {
    if (!entity.combinations || !entity.combinations.length) {
      return '-';
    }
    return new Date(entity.combinations.sort((oldPromo, newPromo) => {
        return new Date(oldPromo.validFrom).getTime() - new Date(newPromo.validFrom).getTime();
      })[0].validFrom).toUTCString();
  }

  getValidTo(entity: IPromoGroup): string {
    if (!entity.combinations || !entity.combinations.length) {
      return '-';
    }
    return new Date(entity.combinations.sort((oldPromo, newPromo) => {
      return new Date(newPromo.validTo).getTime() - new Date(oldPromo.validTo).getTime();
    })[0].validTo).toUTCString();
  }
}
