import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import {FormBuilder, FormArray, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractEditingComponent, IResultResponse } from '@nusantara/core';
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
    <h4 class="subheading-2" i18n>Price List</h4>

    <nus-price-list
      *ngFor="let priceList of form.controls; let i=index;"
      [form]="priceList" (removePriceList)="removePriceList(i)">
    </nus-price-list>

<!--    <div>-->
<!--      <button (click)="addPriceList()" type="button" class="new-add-button wide">-->
<!--        <i class="material-icons">add</i> Add Price List-->
<!--      </button>-->
<!--    </div>-->
  `,
  styles: [
    `div { padding: 12px; border: solid 1px var(--grey); }`,
    'h4 { margin-bottom: 4px; }',
  ],
})
export class PriceListHostComponent extends AbstractEditingComponent<FormArray> implements OnInit {

  @Input() form: FormArray;
  @ViewChildren(PriceListComponent) priceLists!: QueryList<PriceListComponent>;

  types: Array<drf.IChoice>;
  isValid = true;

  protected deletedPriceLists: Array<products.IPriceList> = [];

  constructor(protected service: PriceListService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }

  ngOnInit() {
    this.route.data.subscribe((data: {priceListTypes: drf.IChoice[]}) => {
      this.types = data.priceListTypes;
    });
  }

  addPriceList(entity?: products.IPriceList) {
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
          price: [range.price, [Validators.max(999999999)]],
          maxQuantity: [range.maxQuantity, []],
          minQuantity: [range.minQuantity, []]
        })
      );
    }

    this.form.push(f);
  }

  updatePriceList(entity?: products.IPriceList, index?: number) {
    this.form.at(index).patchValue(entity);
  }

  /**
   * Removes a given pricelist from the form.  If the pricelist has already been persisted
   * to the server, then save the pricelist so that it can be deleted later.
   *
   * @param index the current index within this control's FormArray of the price list
   *
   * @see IPriceList
   */
  removePriceList(index: number) {
    const priceList = this.form.controls[index].value as products.IPriceList;
    if (!!priceList.href) {
      this.deletedPriceLists.push(priceList);
    }
    this.form.removeAt(index);
  }

  saveAll(product: products.IProduct): Observable<IResultResponse[]> {

    // make sure all price lists have the correct product set
    this.priceLists.forEach(value => value.product.setValue(product.href));

    // save all the ranges
    const saveResults = this.priceLists.map(
      component => this.service
        .save(component.toEntity())
        .pipe(map((priceListResult) => {
          return component.saveRanges(priceListResult.entity).subscribe();
        }))
    );

    return zip(
      ...saveResults,
      ...this.deletedPriceLists.map(priceList => this.service.delete(priceList))
    );
  }

  validatePriceListHost(): boolean {
    this.isValid = true;
    this.priceLists.forEach((value) => {
      if (!value.validatePriceList()) {
        this.isValid = false;
      }
    });
    return this.form.valid && this.isValid;
  }

}
