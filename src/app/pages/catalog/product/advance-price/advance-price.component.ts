import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AdvancedPriceListService} from '@nusantara/services';
import {Observable, pipe} from 'rxjs';
import {IAdvancedPriceList} from '@nusantara/models/products/advanced-price-list';
import {getSlugFromHref} from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-advance-price',
  template: `
    <h4 class="subheading-2" i18n>Advance Price</h4>
    <ng-container *ngIf="entity$ | async as entity">
      <table *ngIf="!!entity" class="product-advance-price">
        <thead>
        <tr>
          <th i18n>Price List Name</th>
        </tr>
        </thead>
        <tbody>
        <ng-container *ngFor="let ent of entity; let i = index">
          <tr>
            <td>
              <a [routerLink]="['/catalog', 'advance-price', ent.href|entityToSlug]"
                 [title]="ent.name">{{ ent.name }}</a>
            </td>
          </tr>
        </ng-container>
        </tbody>
      </table>
    </ng-container>

  `,
  styles: []
})
export class AdvancePriceComponent implements OnInit, OnChanges {
  @Input()
  public productHref: string;

  public entity$: Observable<IAdvancedPriceList[]>;

  constructor(private service: AdvancedPriceListService) {
  }

  ngOnInit(): void {

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
