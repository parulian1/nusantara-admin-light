import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'nus-advanced-price-product',
  template: `
    <tr [formGroup]="form">
      <td>{{ form.get('product').get('name').value }}</td>
      <td>{{ form.get('product').get('upc').value }}</td>
      <td>{{ form.get('product').get('price').value | currency:'IDR':'symbol-narrow':'1.0' }}</td>
      <td class="numeric" [ngClass]="{'error-price': errorInput}">
        <div class="input-group">
          <select class="material-icons" [formControl]="amountSign">
            <option class="material-icons" value="negative" aria-label="negative">remove</option>
            <option class="material-icons" value="positive" aria-label="positive">add</option>
          </select>
          <input type="number" [formControl]="amountInput" min="1" />
          <span *ngIf="type == 'percentage'" class="input-group-text">%</span>
        </div>
        <nus-field-errors [control]="amountInput"></nus-field-errors>
      </td>
      <td>{{ finalPrice | currency:'IDR':'symbol-narrow':'1.0' }}</td>
      <td>
        <button (click)="remove.emit()" type="button" class="remove-button">
          <i class="material-icons">remove_circle_outline</i>
        </button>
      </td>
    </tr>
  `,
  styles: [
    ':host { display: contents; }',
    `
      .input-group {
        display: flex;
        align-content: stretch;
      }

      .input-group-text {
        background: var(--white);
        border: solid var(--grey);
        box-sizing: border-box;
        border-radius: 0 4px 4px 0;
        border-width: 1px 1px 1px 0;
        padding: 10px;
      }

      .input-group select {
        width: fit-content;
        border-radius: 4px 0 0 4px;
        border-width: 1px 0 1px 1px;
      }
      .input-group input {
        border-radius: 0 4px 4px 0;
      }

      .error-price .input-group select{
        border-color: var(--error) !important;
      }
      .error-price .input-group input{
        border-color: var(--error) !important;
        background: url('../../../../assets/warning-24px.svg') no-repeat scroll right 5px center !important;
      }
    `
  ]
})

export class AdvancedPriceProductComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() type: string;
  @Input() defaultAmountSign: string;
  @Input() defaultAmountNumber: number;
  @Output() remove: EventEmitter<void> = new EventEmitter();
  @Output() priceError: EventEmitter<void> = new EventEmitter();

  timeoutId: any;
  reloadTimeout = 650;
  finalPrice = 0;
  basePrice = 0;

  amountSign = new FormControl('positive', []);
  amountInput = new FormControl(0, [Validators.min(1)]);
  errorInput = false;

  ngOnInit(): void {
    this.finalPrice = this.form.get('product').get('price').value;
    this.basePrice = this.form.get('product').get('price').value;

    // Calculate the final price each time the user changes the sign or amount
    this.amountInput.valueChanges.subscribe(
      (newValue) => {
        this.calculateFinalPrice(newValue);
      }
    );
    this.amountSign.valueChanges.subscribe(
      () => {
        this.calculateFinalPrice(this.amountInput.value);
      }
    );

    // Set amount input if data already exists
    if (this.form.get('id')) {
      this.amountInput.setValue(Math.abs(this.amount.value));

      if (this.amount.value < 0) {
        this.amountSign.setValue('negative');
      } else {
        this.amountSign.setValue('positive');
      }
    } else {
      this.amountInput.setValue(this.defaultAmountNumber);
      this.amountSign.setValue(this.defaultAmountSign);
    }
  }

  get amount(): FormControl {
    return this.form.get('amount') as FormControl;
  }

  calculateFinalPrice(newValue: number) {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    let amountWithoutSign = 0;
    // wait to see if the user is still typing more before searching
    this.timeoutId = setTimeout(() => {
      amountWithoutSign = newValue;
      if (this.type === 'percentage') {
        amountWithoutSign = this.basePrice * (newValue / 100);
      }

      // convert amount to negative / positive value based on user selection
      const amountWithSign = this.amountSign.value === 'positive' ? Math.abs(amountWithoutSign) : -Math.abs(amountWithoutSign);

      // Calculate product final price for display
      this.finalPrice = this.basePrice + amountWithSign;

      // Set product amount for the advance price
      this.amount.setValue(amountWithSign);

      // Set error to input field if final price below zero
      this.amountSign.setErrors(this.finalPrice < 0 ? {minusPrice: true} : null);
      this.amount.setErrors(this.finalPrice < 0 ? {minusPrice: true} : null);
      this.form.get('amount').setErrors(this.finalPrice < 0 ? {minusPrice: true} : null);
      this.errorInput = this.finalPrice < 0;
      if (this.finalPrice < 0) {
        this.priceError.emit();
      }

    }, this.reloadTimeout);
  }
}
