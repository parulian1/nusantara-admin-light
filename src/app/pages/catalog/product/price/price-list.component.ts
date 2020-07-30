import { AfterViewInit, Component, EventEmitter, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, zip } from 'rxjs';

import { AbstractEditingComponent, IResultResponse } from '@nusantara/core';
import { drf, products } from '@nusantara/models';
import { PriceListRangeService } from '@nusantara/services';
import { RangeComponent } from './range.component';

/**
 * Shows the details for one price list assigned to a product.
 * 'Details' are predominantly a set of 'ranges' that are assigned
 *
 * @see IProduct
 */
@Component({
  selector: 'nus-price-list',
  template: `
    <ng-container [formGroup]="form">
    <tr>

      <td> <button type="button" (click)="toggleExpansion()">{{ type.value }}</button></td>
      <td>{{ ranges.length }}</td>
      <td>{{ ranges.controls[0].value.price }}</td>
      <td>{{ ranges.controls[ranges.length - 1].value.price }}</td>

    </tr>
      <tr *ngIf="isExpanded">
        <td colspan="4">

          <label>
            <span>Type</span>
            <select [formControl]="type">
              <option
                *ngFor="let opt of types"
                [ngValue]="opt.value">{{ opt.displayName }}
              </option>
            </select>
          </label>

          <label class="without-field-errors">
            <input type="checkbox" [formControl]="isProgressive">
            Is Progressive
          </label>

          <table>
            <thead>
            <tr>
              <th>Price</th>
              <th>Min</th>
              <th>Max</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <nus-price-list-range
              *ngFor="let range of ranges.controls; let i=index"
              [form]="range"
              [index]="i"
              [allRanges]="ranges.controls"
              (quantityChanged)="onRangeQuantityChanged(i)"
              (remove)="removeRange($event, i)"
              [siblingQuantityChanged]="rangeQuantityChanged">
            </nus-price-list-range>
            <tr>
              <td colspan="4">
                <button type="button" (click)="addRange()" class="add-button">
                  Add Range
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </ng-container>
  `,
  styles: [':host { display: contents; }', ]
})
export class PriceListComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  private static readonly MINIMUM_QUANTITY  = 1;
  private static readonly DEFAULT_PRICE = 10_000;

  isExpanded = false;

  @Input() form: FormGroup;
  @ViewChildren(RangeComponent) rangeComponents: QueryList<RangeComponent>;
  rangeQuantityChanged = new EventEmitter<number>();
  types: Array<drf.IChoice>;

  public deletedRanges: Array<products.IPriceListRange> = [];

  constructor(protected rangeService: PriceListRangeService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder) { super(); }

  get href(): FormControl { return this.form.get('href') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }
  get product(): FormControl { return this.form.get('product') as FormControl; }
  get ranges(): FormArray { return this.form.get('ranges') as FormArray; }
  get isProgressive(): FormControl { return this.form.get('isProgressive') as FormControl; }
  get platforms(): FormArray { return this.form.get('platforms') as FormArray; }
  get locations(): FormArray { return this.form.get('locations') as FormArray; }

  ngOnInit() {
    this.route.data.subscribe((data: {priceListTypes: drf.IChoice[]}) => {
      this.types = data.priceListTypes;
    });
  }

  ngAfterViewInit() {
    this.rangeComponents.changes.subscribe((value) => {
      this.rangeComponents.forEach((c) => c.updateValidators());
    });
    this.rangeComponents.notifyOnChanges();
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Gets this component's current value as the underlying entity
   * type that is represents.
   */
  toEntity(): products.IPriceList {
    return this.form.value as products.IPriceList;
  }

  /**
   * Adds a new range to a pricelist.
   */
  addRange(range?: products.IPriceListRange) {
    let f: FormGroup;
    if (!range) {
      // adding a new range
      let minQuantity = PriceListComponent.MINIMUM_QUANTITY;
      let price = PriceListComponent.DEFAULT_PRICE;

      if (!!this.ranges.length) {
        const terminalRange = this.ranges.controls[this.ranges.length - 1];
        // set the previous terminal range's max quantity = it's min quantity
        terminalRange.get('maxQuantity').setValue(terminalRange.get('minQuantity').value);
        minQuantity = terminalRange.get('maxQuantity').value + 1;
        price = terminalRange.get('price').value;
      }
      f = this.fb.group({
        href: ['', []],
        priceList: [this.href.value, []],
        price: [price, [Validators.required, Validators.min(0)]],
        maxQuantity: [null, []],
        minQuantity: [minQuantity, [Validators.required, ]]
      });
    } else {
      // this is either the first range .. or an existing range
      f = this.fb.group({
        href: [range?.href, []],
        priceList: [range?.priceList, []],
        price: [range?.price, []],
        maxQuantity: [range?.maxQuantity, []],
        minQuantity: [range?.minQuantity, []]
      });
    }
    this.ranges.push(f);
  }

  /**
   * Removes a range from the pricing table.
   *
   * @see IPriceListRange
   */
  removeRange(event: RangeComponent, index: number): void {

    // if the object has an href, then it was already stored on the server
    // so we have to remember to perform an HTTP DELETE later
    if (!!event.href.value) {
      this.deletedRanges.push(event.form.value as products.IPriceListRange);
    }

    this.ranges.removeAt(index);

    // update the price range quantity for the range **after** the range we just
    // removed.
    const predecessorRange = this.ranges.controls[index - 1];
    if (this.ranges.length >= index + 1) {
      const successorRange = this.ranges.controls[index];
      successorRange.get('minQuantity').setValue(predecessorRange.get('maxQuantity').value + 1);
    }
  }

  /**
   * Raises notification whenever either quantity (min or max) on a price list range
   * is changed, so that the neighboring price lists can adjust themselves.
   *
   * @param index The index of the price list range that was changed.
   * @see IPriceListRange
   */
  onRangeQuantityChanged(index: number): void {
    this.rangeQuantityChanged.emit(index);
  }

  /**
   * Saves all the _price list ranges_ in this price list (not the price list itself).
   * This will also delete any removed ranges that have already been saved to the server.
   *
   * @param priceList The price list that owns this range.
   */
  saveRanges(priceList: products.IPriceList): Observable<IResultResponse<products.IPriceListRange>[]> {

    // ensure ranges have their parent price list set
    this.rangeComponents.forEach((component) => { component.priceList.setValue(priceList.href); });

    return zip(
      ...this.rangeComponents.map(component => this.rangeService.save(component.toEntity())),
      ...this.deletedRanges.map(range => this.rangeService.delete(range))
    );
  }
}
