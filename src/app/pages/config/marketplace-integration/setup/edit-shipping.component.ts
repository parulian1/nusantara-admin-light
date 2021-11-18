import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { marketplace } from '@nusantara/models';
import { MarketplaceShopService } from '@nusantara/services';
import { ToastLevelEnum, ToastService } from '@nusantara/core';
import * as fromReducer from '@nusantara/reducers';
@Component({
  selector: 'nus-edit-shipping',
  template: `
    <h1 class="title-1" i18n>Edit Shipping</h1>
    <div class="container">
      <div class="wrapper store-info">
        <div>
          <div i18n>Store</div>
          <div>
            <strong>{{ (currentShop$ | async)?.name }}</strong>
          </div>
        </div>
        <div>
          <div i18n>Marketplace</div>
          <div>
            <strong>{{ (currentShop$ | async)?.marketplace | titlecase }}</strong>
          </div>
        </div>
        <div>
          <div i18n>Status</div>
          <div>
            <strong>
              {{ (currentShop$ | async)?.isConnected === true? 'Connected':'Not Connected'}}
            </strong>
          </div>
        </div>
      </div>

      <form [formGroup]="form" class="fluid">
        <table>
          <thead>
            <tr>
              <th i18n>Logistic</th>
              <th class="centered" i18n>Is Active</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let attr of shipping.controls; let i = index">
              <td>
                <strong>{{ logistics[i].name }}</strong>
              </td>
              <td class="centered">
                <!-- <input
                  type="checkbox" class="toggle"
                  [formControl]="attr"
                  formArrayName="shipping"/> -->

                <mat-slide-toggle
                  [formControl]="attr">
                </mat-slide-toggle>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="action-buttons">
          <button *ngIf="!readOnly.includes((currentShop$ | async)?.marketplace)"
            type="button"
            class="control"
            (click)="onSubmit()"
            [disabled]="isBusy" i18n>
            Save
          </button>
          <button type="button" class="control" (click)="onBack()"
            [ngClass]="{ 'secondary ghost': !readOnly.includes((currentShop$ | async)?.marketplace) }" i18n>
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    '.container { width: 60vw; }',
    '.wrapper { display: grid; border: solid 1px var(--grey); border-radius: 4px;}',
    '.store-info { grid-template-columns: 4fr 3fr 3fr; padding: 20px 24px;  margin-bottom: 24px; }',
    '.shipping-option { grid-template-columns: 5fr 1fr; padding: 14px 24px; margin-bottom: 16px }',
    '.shipping-option > div:last-child { align-self: end; }',
    '.toggle { margin-right: 16px }',
    '.action-buttons { margin-top: 30px; }',
    'button:not(:first-of-type) { margin-left: 5px; }',
    '::ng-deep mat-slide-toggle label { min-height: 40px; }'
  ],
})
export class EditShippingComponent implements OnInit, OnDestroy {
  form: FormGroup;
  shopSlug: string;
  currentShop$: Observable<marketplace.IShop>;
  marketplace: string;
  logistics: marketplace.ILogistic[];
  isBusy: boolean;

  subscription: Subscription;

  readOnly = [
    'tsc',
    'lazada',
    'tokopedia',
    'bukalapak'
  ]

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: MarketplaceShopService,
    private toast: ToastService,
    private store: Store<fromReducer.State>
  ) {
    this.initializeForm();
    this.currentShop$ = this.store.select(fromReducer.getCurrentShop);
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    this.subscription = this.currentShop$.subscribe(shop => {
      this.marketplace = shop.marketplace;
    });

    this.route.data.subscribe((data: { logistics: marketplace.ILogistic[] }) => {
      this.logistics = data.logistics;
      this.addCheckboxes();
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  private initializeForm() {
    this.form = this.fb.group({
      shipping: this.fb.array([]),
    });
  }

  addCheckboxes() {
    const checkboxes = this.buildCheckboxes(this.logistics);
    if (checkboxes) {
      checkboxes.forEach((attr: FormControl) => {
        if (this.readOnly.includes(this.marketplace)) {
          attr.disable();
        }
        this.shipping.push(attr);
      });
    }
  }

  buildCheckboxes(attributes: marketplace.ILogistic[]) {
    if (attributes) {
      const arr = attributes.map((attr) => {
        return this.fb.control(attr.enabled);
      });
      return arr;
    }
  }

  get shipping() {
    return this.form.get('shipping') as FormArray;
  }

  toggleCheck(value: boolean) {
    this.shipping.controls.map((control: FormControl) => {
      value === true ? control.setValue(true) : control.setValue(false);
    });
  }

  onBack() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  onSubmit() {
    // only submit changed value
    const shippingValues = this.shipping.value
      .map((selected: boolean, i: number) => {
        return {
          logisticId: this.logistics[i].logisticId,
          enabled: selected,
        };
      })
      .filter(
        (selected: boolean, i: number) => selected !== this.logistics[i].enabled
      );

    this.service
      .patchLogistic(this.shopSlug, { logistics: shippingValues })
      .subscribe(
        (resp: any) => {
          this.toast?.addMessage(
            resp.message,
            'Success Saved Shipping',
            ToastLevelEnum.success
          );
          this.onBack();
        },
        (err: HttpErrorResponse) => {
          this.toast?.addMessage(
            err.error.message,
            'error',
            ToastLevelEnum.error
          );
        }
      );
  }
}
