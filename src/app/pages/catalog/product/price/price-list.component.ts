import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormArray, FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Observable, zip} from 'rxjs';

import {AbstractEditingComponent, IResultResponse, Logger} from '@nusantara/core';
import {drf, products} from '@nusantara/models';
import {PriceListRangeService, PriceListService, SiteConfigService} from '@nusantara/services';
import {RangeComponent} from './range.component';

const logger = new Logger('PriceListComponent');

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
      <div class="list price-list-container" *ngIf="false">
        <div [hidden]="true">
          <div class="body-2" i18n>Type</div>
          <div class="subheading-2"> {{ type.value | titlecase }} </div>
        </div>
        <div [hidden]="true">
          <div class="body-2" i18n>Start</div>
          <div class="subheading-2">
            {{ ranges.controls.length ? ranges.controls[0].value.price : 0 }}
          </div>
        </div>
        <div [hidden]="true">
          <div class="body-2" i18n>Ending</div>
          <div class="subheading-2">
            {{ ranges.controls.length ? ranges.controls[ranges.length - 1].value.price : 0 }}
          </div>
        </div>
        <div [hidden]="true">
          <!--         #97699 and #97726 no make any sense show / use delete or toggle expansion  -->
          <button type="button" (click)="removePriceList.emit()" class="delete" disabled="!allowDelete">
            <i class="material-icons">delete_outline</i>
          </button>
          <!--  <button type="button" (click)="toggleExpansion()" class="expand">-->
          <!--    <i class="material-icons"> {{ isExpanded? 'expand_less' : 'expand_more'}}</i>-->
          <!--  </button>-->
        </div>
      </div>
      <div *ngIf="isExpanded" class="price-list-container">
        <div [hidden]="true">
          <label>
            <span i18n>Type</span>
            <select [formControl]="type"
                    name="pricelist-type"
                    data-qa="pricelist-type">
              <option
                *ngFor="let opt of types"
                [ngValue]="opt.value">{{ opt.displayName }}
              </option>
            </select>
          </label>
        </div>
        <div class="inline-option" role="radiogroup" aria-labelledby="radio_label">
          <label class="radio" role="radio">
            <input type="radio" [value]="true" [formControl]="isProgressive">
            <span>
              <ng-container i18n>Progressive</ng-container>
              <span class="tooltip">
                <span class="material-icons">info_outline</span>
                <div class="tooltip-wrapper">
                  <div class="tooltip-arrow"></div>
                <div class="tooltiptext">
                  <h4>Progressive</h4>
                  <p>Buy 12 pcs<br>
                    First 10pcs x 300.000 = 3.000.000<br>
                    Next 2pcs x 295.000 = 590.000<br>
                    TOTAL: 3.590.000
                  </p>
                </div>
                </div>
              </span>
            </span>
          </label>
          <label class="radio" role="radio">
            <input type="radio" [value]="false" [formControl]="isProgressive">
            <span>
              <ng-container i18n>Non Progressive</ng-container>
              <span class="tooltip">
                <span class="material-icons">info_outline</span>
                <div class="tooltip-wrapper">
                  <div class="tooltip-arrow"></div>
                <div class="tooltiptext">
                    <h4>Non Progressive</h4>
                    <p>Buy 12 pcs<br>12pcs x 295.000 = 3.540.000</p>
                </div>
                  </div>
              </span>
            </span>

          </label>
        </div>
        <div class="price-list-grid wrapper">
          <div class="price-list-range-wrapper">
            <nus-price-list-range
              *ngFor="let range of ranges?.controls; let i=index"
              [form]="range"
              [index]="i"
              [hasTitle]="i===0"
              [allRanges]="ranges?.controls"
              (quantityChanged)="onRangeQuantityChanged(i)"
              (remove)="removeRange($event, i)"
              [siblingQuantityChanged]="rangeQuantityChanged">
            </nus-price-list-range>
          </div>
          <div class="price-list-range-action-wrapper">
            <button type="button" (click)="addRange()" class="new-add-button wide">
              <i class="material-icons">add</i>
              <ng-container i18n>Add Range</ng-container>
            </button>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [':host { display: contents; }',
    '.price-list-wrapper { padding: 12px; }',
    '.wrapper { padding: 1px; border: solid 1px var(--grey);border-radius: 4px;}',
    '.list { display: grid; grid-template-columns: repeat(3, 1fr) 70px; align-items: center; }',
    '.list div:last-child { display: flex; justify-content: space-between; }',
    '.range { margin-bottom: 16px; display: grid; grid-template-columns: 1fr 20px 1fr 1fr 20px; gap: 16px; }',
    '.expand, .delete { background: none; border: none; outline: none; font-size: 18px; cursor: pointer; }',
    '.delete { opacity: .5 }',
    '.body-2 { margin-bottom: 4px }',
    `
      .inline-option label {
        padding-bottom: 0;
        min-height: auto;
        display: flex;
      }

      label.radio span {
        display: flex;
      }

      .price-list-range-action-wrapper {
        padding: 8px;
      }

      /* Tooltip container */
      .tooltip {
        position: relative;
        background: #ffffff;
      }
      .tooltip .tooltip-wrapper {
        filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.16)) drop-shadow(0px -2px 6px rgba(0, 0, 0, 0.08));
        /* Position the tooltip text - see examples below! */
        position: absolute;
        z-index: 1;
        visibility: hidden;
      }
        .tooltip .tooltip-arrow {
          position: absolute;
          width: 17.68px;
          height: 17.68px;
          left: 5px;
          top: 17px;
          background: #FFFFFF;
          transform: rotate(-45deg);
        }
      /* Tooltip text */
      .tooltip .tooltiptext {
        background: #FFFFFF;
        border-radius: 4px;
        width: 300px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        left: -10px;
        top: 24px;
        position: absolute;
      }

      /* Show the tooltip text when you mouse over the tooltip container */
      .tooltip:hover .tooltip-wrapper {
        visibility: visible;
      }

      .tooltip .tooltip-wrapper {
        top: 50%;
        left: 0;
      }
    `
  ]
})
export class PriceListComponent extends AbstractEditingComponent implements OnInit, AfterViewInit {

  private static readonly MINIMUM_QUANTITY = 1;
  private static readonly DEFAULT_PRICE = 10_000;
  isExpanded = true;

  @Input() form: FormGroup;
  @ViewChildren(RangeComponent) rangeComponents: QueryList<RangeComponent>;
  rangeQuantityChanged = new EventEmitter<number>();
  types: Array<drf.IChoice>;

  public deletedRanges: Array<products.IPriceListRange> = [];

  @Output() removePriceList: EventEmitter<any> = new EventEmitter<any>();
  @Input() allowDelete = true;

  constructor(protected rangeService: PriceListRangeService,
              protected route: ActivatedRoute,
              protected fb: FormBuilder,
              private configSercvice: SiteConfigService,
              protected priceListService: PriceListService) {
    super();
  }

  get href(): FormControl {
    return this.form.get('href') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get product(): FormControl {
    return this.form.get('product') as FormControl;
  }

  get ranges(): FormArray {
    return this.form.get('ranges') as FormArray;
  }

  get isProgressive(): FormControl {
    return this.form.get('isProgressive') as FormControl;
  }

  get platforms(): FormArray {
    return this.form.get('platforms') as FormArray;
  }

  get locations(): FormArray {
    return this.form.get('locations') as FormArray;
  }

  ngOnInit() {
    this.route.data.subscribe((data: { priceListTypes: drf.IChoice[] }) => {
      // #97699 and #97726 make type choice only 'default'
      this.types = data.priceListTypes.filter(priceList => priceList.value === 'default');
    });

    // triggers change
    if (!this.enterpriseLicense()) {
      this.toggleExpansion();
      if (!this.ranges.length) {
        this.addRange();
      }
    }
    this.isProgressive.markAsTouched();
  }

  ngAfterViewInit() {
    this.rangeComponents.changes.subscribe((value) => {
      this.rangeComponents.forEach((c) => c.updateValidators());
    });
    this.rangeComponents.notifyOnChanges();
  }

  toggleExpansion() {
    this.isExpanded = true;
    // this.isExpanded = !this.isExpanded;
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
      if (!this.enterpriseLicense()) {
        price = 0;
      }

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
        minQuantity: [minQuantity, [Validators.required,]]
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
    if (this.ranges.length === 1) {
      logger.debug('renmove-1', this.ranges.length, index);
      const maxQuantity = predecessorRange.get('maxQuantity');
      maxQuantity.setValue(null);
      maxQuantity.clearValidators();
      maxQuantity.updateValueAndValidity({emitEvent: false});
    } else {
      const lastRange = this.ranges.controls[this.ranges.controls.length - 1];
      const lrMaxQuantity = lastRange.get('maxQuantity');
      lrMaxQuantity.setValue(null);
      lrMaxQuantity.setValidators([]);
      lrMaxQuantity.updateValueAndValidity({emitEvent: false});

      if (this.ranges.length >= index + 1) {
        const successorRange = this.ranges.controls[index];
        successorRange.get('minQuantity').setValue(predecessorRange.get('maxQuantity').value + 1);
      }
      // if (this.ranges.length === index ) {
      //   logger.debug('renmove-2', this.ranges.length, index);
      //   const successorRange = this.ranges.controls[this.ranges.length - 1];
      //   const maxQuantity = successorRange.get('maxQuantity');
      //   maxQuantity.setValue(null);
      //   maxQuantity.setValidators([]);
      //   maxQuantity.updateValueAndValidity();
      // }
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
    logger.debug('onRangeQuantityChanged', index, this.ranges.controls.length);
    const currentRange = this.ranges.controls[index];
    if (this.ranges.controls.length > 1) {
      if (index >= 1) {
        const predecessorRange = this.ranges.controls[index - 1];
        predecessorRange.patchValue({
          maxQuantity: currentRange.get('minQuantity').value - 1,
        }, {emitEvent: false});
        // predecessorRange.updateValueAndValidity();
      }
      if (this.ranges.controls.length > index + 1) {
        const successorRange = this.ranges.controls[index + 1];
        successorRange.patchValue({
          minQuantity: currentRange.get('maxQuantity').value + 1
        }, {});
        // successorRange.updateValueAndValidity();
      }
    }
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
    this.rangeComponents.forEach((component) => {
      component.priceList.setValue(priceList.href);
    });

    return zip(
      ...this.rangeComponents.map(component => this.rangeService.save(component.toEntity())),
      ...this.deletedRanges.map(range => this.rangeService.delete(range))
    );
  }

  enterpriseLicense() {
    return this.configSercvice.isEnterpriseLicense();
  }

  validatePriceList(): boolean {
    let isValid = true;
    this.rangeComponents.forEach((component) => {
      if (!component.validatePriceRange()) {
        isValid = false;
      }
    });
    return this.form.valid && isValid;
  }

}
