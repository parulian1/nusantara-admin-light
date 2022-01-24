import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {ILowStock} from '@nusantara/models/products';
import {LowStockService} from '@nusantara/services/low-stock.service';
import {drf, IWarehouse} from '@nusantara/models';

@Component({
  selector: 'nus-low-stock-config',
  template: `
    <h1 class="title-1" i18n>Low Stock Config</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="fluid">
      <nus-tabs>
        <nus-tab [title]="'Stock Configuration'">
          <div class="low-stock-config">
            <h3>Low Stock Alert</h3>

            <label class="checkbox" style="min-height: 1rem;">
              <input type="checkbox" name="isActive" [formControl]="isActive" i18n> Is Active
              <nus-field-errors [control]="isActive"></nus-field-errors>
            </label>

            <label>
              <span i18n>Low Stock Qty</span>
              <input type="text" placeholder="insert quantity threshold" [formControl]="quantity">
              <nus-field-errors [control]="quantity"></nus-field-errors>
            </label>

            <label>
              <span i18n>Email Alert</span>
              <p i18n class="body-2">Send daily email notification when stock is low. / Email notification will be send
                regularly every 6 am</p>
              <div class="email-input">
                <input type="text"
                       placeholder="insert email to receive daily notification"
                       (keydown)="removeChipAlert()"
                       (keydown.enter)="addChips()"
                       [formControl]="email"
                       #emailInput>
                <button type="button" class="control" [disabled]="!this.email.valid" (click)="addChips()">Add</button>
              </div>
              <div class="email-chip-error">{{emailChipError}}</div>
              <nus-field-errors [control]="email"></nus-field-errors>
            </label>

            <div class="email-chips">
              <div class="email-chip-item" *ngFor="let email of emails.value; let i=index">
                <span>{{email}}</span>
                <button type="button">
                  <img src="./../../../../assets/cross-circle.svg" (click)="removeChips(email)" alt="x">
                </button>
              </div>
            </div>

            <button type="submit" class="control save" i18n>
              Save
            </button>
          </div>
        </nus-tab>
        <nus-tab [title]="'Product List'">
          <nus-low-stock-product-list
            [warehouses]="warehouses"
            [subLocationTypes]="subLocationTypes"
          ></nus-low-stock-product-list>
        </nus-tab>
      </nus-tabs>
    </form>
    <div class="footer-actions">
      <button type="button" (click)="navigateToParent(true)" class="control" i18n>
        Back
      </button>
    </div>
  `,
  styles: [`
    .low-stock-config {
      margin-top: 24px;
      border: 1px solid var(--grey);
      border-radius: 8px;
      padding: 8px 16px;
      width: 65%;
    }

    .low-stock-config h3 {
      margin: 8px 0 16px 0;
    }

    .low-stock-config label .email-input {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .low-stock-config label .email-input input {
      max-width: 600px;
    }

    .low-stock-config label .email-chip-error {
      font-size: 11px;
      color: var(--error);
    }

    .low-stock-config .email-chips {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .low-stock-config .email-chips .email-chip-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      background: var(--darken-white);
      border-radius: 24px;
      padding: 6px 8px;
      margin: 4px 2px 0 0;
    }

    .low-stock-config .email-chips .email-chip-item span {
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
      color: var(--darken-grey);
    }

    .low-stock-config .email-chips .email-chip-item button {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }

    .low-stock-config button[type=submit] {
      width: 280px;
    }

    .footer-actions {
      display: flex;
      margin-top: 1.5em;
    }
  `]
})
export class LowStockConfigComponent extends AbstractDetailComponent<ILowStock> implements OnInit {
  @ViewChild('emailInput') emailInput: ElementRef;

  entity: ILowStock;
  warehouses: Array<{ href: string, name: string, code: string }>;
  subLocationTypes: Array<drf.IChoice>;

  emailChipError = '';

  constructor(route: ActivatedRoute,
              router: Router,
              service: LowStockService,
              toast: ToastService,
              public fb: FormBuilder) {
    super(route, router, toast, service);
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get quantity(): FormControl {
    return this.form.get('quantity') as FormControl;
  }

  get emails(): FormArray {
    return this.form.get('emails') as FormArray;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.route.data.subscribe((data: {
      entity: ILowStock,
      subLocationTypes: drf.IChoice[],
      allWarehouses: IWarehouse[]
    }) => {
      this.entity = data.entity;
      this.subLocationTypes = data.subLocationTypes;
      this.warehouses = data.allWarehouses;
      this.warehouses.unshift({href: null, name: 'Select Warehouse', code: ''});
    });
  }

  initializeForm(entity?: ILowStock) {
    this.form = this.fb.group({
      href: [entity?.href, []],
      isActive: [entity?.isActive, []],
      quantity: [entity?.quantity, [Validators.required, Validators.min(1), Validators.pattern(`^\\d+$`)]],
      email: [entity?.email, [Validators.required, Validators.pattern(`^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`)]],
      emails: this.fb.array([])
    });

    this.form.controls.isActive.markAsTouched();

    entity?.emails.forEach(value => {
      this.emails.push(this.fb.control(value.toLowerCase(), []));
    });
  }

  addChips() {
    if (this.emailInput.nativeElement.value === '') {
      return;
    }

    if (this.emails.value.findIndex(item => item === this.email.value) !== -1) {
      this.emailChipError = 'Email already inserted. Please check again';
      return;
    }

    if (this.email.valid) {
      this.emails.push(this.fb.control(this.email.value.toLowerCase(), []));
      this.emailInput.nativeElement.value = '';
    } else {
      this.emailChipError = 'Invalid email. Please enter valid email.';
    }
  }

  removeChips(email: string) {
    const index = this.emails.value.findIndex(item => item === email);
    this.emails.removeAt(index);
  }

  removeChipAlert() {
    this.emailChipError = '';
  }
}
