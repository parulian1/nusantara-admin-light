import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {ILowStock} from '@nusantara/models/products';
import {LowStockService} from '@nusantara/services/low-stock.service';

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
              <span i18n class="email-label">Send daily email notification when stock is low. / Email notification will be send regularly every 6 am</span>
              <div class="email-input">
                <input type="text" placeholder="insert email to send daily notification" [formControl]="email"
                       #emailInput>
                <button type="button" class="control" (click)="addChips($event)">Add</button>
              </div>
              <nus-field-errors [control]="email"></nus-field-errors>
            </label>

            <div class="email-chips">
              <div class="email-chip-item" *ngFor="let email of listEmail; let i=index">
                <span>{{email}}</span>
                <button (click)="removeChips(i)">
                  <img src="./../../../../assets/cross-circle.svg">
                </button>
              </div>
            </div>

          </div>
        </nus-tab>
        <nus-tab [title]="'Product List'">
        </nus-tab>
      </nus-tabs>
      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>
    </form>
  `,
  styles: [`
    .low-stock-config {
      margin-top: 24px;
      border: 1px solid #B4B4B4;
      border-radius: 8px;
      padding: 8px 16px;
      width: 65%;
    }

    .low-stock-config h3 {
      margin: 8px 0 16px 0;
    }

    .low-stock-config label .email-label {
      color: #5A5A5A;
      line-height: 20px;
    }

    .low-stock-config label .email-input {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .low-stock-config label .email-input input {
      max-width: 600px;
    }

    .low-stock-config .email-chips {
      display: flex;
      flex-wrap: wrap;
    }

    .low-stock-config .email-chips .email-chip-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      background: #F4F4F4;
      border-radius: 24px;
      padding: 6px 8px;
      margin: 4px 2px 0 0;
    }

    .low-stock-config .email-chips .email-chip-item button {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }
  `]
})
export class LowStockConfigComponent extends AbstractDetailComponent<ILowStock> implements OnInit {
  @ViewChild('emailInput') emailInput: ElementRef;

  entity: ILowStock;

  listEmail = [];

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

  ngOnInit(): void {
    super.ngOnInit();
  }

  initializeForm(entity?: ILowStock) {
    this.form = this.fb.group({
      isActive: [entity?.isActive, []],
      quantity: [entity?.quantity, []],
      email: [entity?.email, [Validators.pattern(`^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$`)]],
    });
  }

  addChips($event: any) {
    if (this.email.valid) {
      this.listEmail.push(this.email.value);
      console.log(this.emailInput);
      this.emailInput.nativeElement.value = '';
    }
  }

  removeChips(index: number) {
    console.log(`remove chips-${index}`);
  }
}
