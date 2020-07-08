import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AbstractEditingComponent } from '@nusantara/core';
import { drf, products } from '@nusantara/models';
import { PriceListService } from '@nusantara/services';
import { PriceListComponent } from './price-list.component';

/**
 * Shows the price lists configured for a given product.
 *
 * Note: Each must have at least 1 price list of type default.
 * The default price list cannot be removed, and only 1 default price
 * list can be assigned to a product.
 */
@Component({
  selector: 'nus-price-list-host',
  template: `
    <h2>
      Price Lists
      <button (click)="add()" type="button">Add</button>
    </h2>
    <div>
      <nus-price-list
        *ngFor="let priceList of form.controls"
        [form]="priceList">
      </nus-price-list>
    </div>
  `,
  styles: []
})
export class PriceListHostComponent extends AbstractEditingComponent<FormArray> implements OnInit {

  @Input() form: FormArray;
  @ViewChildren(PriceListComponent) priceLists!: QueryList<PriceListComponent>;

  types: Array<drf.IChoice>;

  constructor(protected service: PriceListService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }

  ngOnInit() {
    this.route.data.subscribe((data: {priceListTypes: drf.IChoice[]}) => {
      this.types = data.priceListTypes;
    });
  }

  add(entity?: products.IPriceList) {
    const f = this.fb.group({
      type: [entity?.type || this.types[0].value, []],
      href: [entity?.href, []],
      product: [entity?.product, []],
      ranges: this.fb.array([]),
      isProgressive: [entity?.isProgressive || false, []],
      platforms: this.fb.array([]),
      locations: this.fb.array([]),
    });

    const rangeArray = f.get('ranges') as FormArray;
    for (const r of entity?.ranges ?? []) {
      const range: products.IPriceListRange = r;
      rangeArray.push(
        this.fb.group({
          href: [range.href, []],
          priceList: [range.priceList, []],
          price: [range.price, []],
          maxQuantity: [range.maxQuantity, []],
          minQuantity: [range.minQuantity, []]
        })
      );
    }

    this.form.push(f);

  }
  remove(index: number) { this.form.removeAt(index); }

}
