import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AdvancedPriceListService} from '@nusantara/services';
import {Observable} from 'rxjs';
import {IAdvancedPriceList} from '@nusantara/models/products/advanced-price-list';
import {getSlugFromHref} from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-advance-price',
  template: `
    <h4 class="subheading-2" i18n>Advance Price</h4>

    <table class="product-advance-price">
      <thead>
      <tr>
        <th i18n>Price List Name</th>
      </tr>
      </thead>
      <ng-container *ngIf="entity$ | async as entity">
        <tbody *ngIf="!!entity">
        <ng-container *ngFor="let ent of entity; let i = index">
          <tr>
            <td>
              <a [routerLink]="['/catalog', 'advanced-price', ent.href|entityToSlug]" target="_blank"
                 [title]="ent.name">{{ ent.name }}</a>
            </td>
          </tr>
        </ng-container>
        </tbody>
      </ng-container>
    </table>
  `
})
export class AdvancePriceComponent implements OnChanges {
  @Input()
  public productHref: string;

  public entity$: Observable<IAdvancedPriceList[]>;

  constructor(private service: AdvancedPriceListService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'productHref': {
            if (!!changes[propName].currentValue) {
              this.entity$ = this.service.search_by_product_slug(getSlugFromHref(changes[propName].currentValue));
            }
            break;
          }
        }
      }
    }
  }

}
