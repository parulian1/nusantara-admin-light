import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlContainer, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {products, ISubLocation} from '@nusantara/models';
import {IProductClass} from '../../../models/products';
import {Logger} from '@nusantara/core';
import {maxDateValidator, minDateValidator} from '@nusantara/core/helpers/validators';

const logger = new Logger('InventoryReceivingLine');

@Component({
  selector: 'nus-inventory-receiving-line',
  template: `
    <tr [formGroup]="form">
      <td title="{{ displayedProductName }}">{{ displayedProductName }}</td>
      <td class="immediate-error-display">
        <input type="text" [formControl]="sku" data-qa="sku" placeholder="Input SKU" i18n-placeholder>
        <nus-field-errors [control]="sku"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <input type="number" min="1" [formControl]="originalQuantity" data-qa="original-quantity"
               placeholder="Input 1-10000" i18n-placeholder>
        <nus-field-errors [control]="originalQuantity"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <input type="text" [formControl]="batchNumber" data-qa="batch-number" placeholder="Input Batch"
               i18n-placeholder>
        <nus-field-errors [control]="batchNumber"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <input *ngIf="isPerishable" type="date" [formControl]="expiryDate" data-qa="expiry-date">
        <span *ngIf="!isPerishable" i18n>Non Perishable</span>
        <nus-field-errors [control]="expiryDate"></nus-field-errors>
      </td>
      <td class="immediate-error-display">
        <div class="prepend-label">
          <span class="prepended-label">Rp.</span>
          <input type="number" [formControl]="cost" data-qa="cost" placeholder="Input 0-999.999.999" i18n-placeholder>
        </div>
        <nus-field-errors [control]="cost"></nus-field-errors>
      </td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button" data-qa="remove-button" title="Remove"
                i18n-title>
          <i class="material-icons">delete_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    'td:not(:first-child) { width: 12%; }',
    'td:nth-child(7) { width: 5%; text-align: center; }',
    `
      .prepend-label {
        position: relative;
      }

      .prepend-label span.prepended-label {
        margin-left: 0;
        position: absolute;
        display: block;
        transform: translate(0, -50%);
        top: 50%;
        pointer-events: none;
        width: 25px;
        text-align: center;
        font-style: normal;
      }

      .prepend-label > input {
        padding-left: 30px;
      }
    `
  ]
})
export class LineItemComponent implements OnInit, OnChanges{

  @Input() availableSubLocations: ISubLocation[] = [];
  @Input() productClasses: IProductClass[];
  @Output() remove = new EventEmitter<void>();
  @Input() form: FormGroup;

  minDate: Date;
  maxDate: Date;
  isPerishable = false;


  constructor(private controlContainer: ControlContainer) {
  }

  get displayedProductName(): string {
    const p = this.product.value as products.IProduct;
    return `${p.name} (${p.upc})`;
  }

  get product(): FormControl {
    return this.form.get('product') as FormControl;
  }

  get location(): FormGroup {
    return this.form.get('location') as FormGroup;
  }

  get originalQuantity(): FormControl {
    return this.form.get('originalQuantity') as FormControl;
  }

  get sku(): FormControl {
    return this.form.get('sku') as FormControl;
  }

  get locator(): FormArray {
    return this.form.get('locator') as FormArray;
  }

  get expiryDate(): FormControl {
    return this.form.get('expiryDate') as FormControl;
  }

  get batchNumber(): FormControl {
    return this.form.get('batchNumber') as FormControl;
  }

  get cost(): FormControl {
    return this.form.get('cost') as FormControl;
  }

  ngOnInit() {
    // this.form = (this.controlContainer.control as FormGroup);
    this.sku.setValidators([Validators.pattern('^[A-Z0-9a-z-/&_]+$'), Validators.maxLength(20), Validators.required]);
    this.batchNumber.setValidators([Validators.maxLength(30), Validators.pattern('^[A-Z0-9]+$')]);
    this.cost.setValidators([Validators.max(999999999), Validators.min(0), Validators.required, Validators.pattern('^[0-9]+$')]);
    this.originalQuantity.setValidators([Validators.min(1), Validators.max(10000), Validators.required, Validators.pattern('^[0-9]+$')]);
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.minDate.getFullYear() + 10);
    if (this.isPerishable) {
      this.expiryDate.setValidators([
        Validators.required,
        minDateValidator(this.minDate),
        maxDateValidator(this.maxDate)
      ]);
      this.expiryDate.updateValueAndValidity()
    } else {
      this.expiryDate.clearValidators();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const p = this.product.value as products.IProduct;
    let currentPc = [];
    if (!!this.productClasses) {
      currentPc = this.productClasses.filter(pc => {
        logger.debug('pcfilter', pc.href, p.productClass.href)
        return pc.href === p.productClass.href;
      });
    }
    if (currentPc.length > 0) {
      logger.debug('ngOnChanges isPerishable')
      this.isPerishable = currentPc[0].isPerishable;
    } else {
      logger.debug('ngOnChanges not isPerishable')
      this.isPerishable = false;
    }

    if (this.isPerishable) {
      this.expiryDate.setValidators([
        Validators.required,
        minDateValidator(this.minDate),
        maxDateValidator(this.maxDate)
      ]);
      this.expiryDate.updateValueAndValidity()
    } else {
      this.expiryDate.clearValidators();
    }
  }

}
