import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ILogistic, IShop } from '@nusantara/models';
import { MarketplaceShopService } from '@nusantara/services';
import { ToastLevelEnum, ToastService } from '@nusantara/core';
import * as fromReducer from '@nusantara/reducers';

@Component({
  selector: 'nus-product-class-mapping-form',
  template: `
    <h1 class="heading-1">Edit Shipping</h1>
    <div class="store-info wrapper">
      <div class="store-info">
        <div>Store</div>
        <div>
          <strong>{{ (currentShop$ | async)?.name }}</strong>
        </div>
      </div>
      <div class="store-info">
        <div>Marketplace</div>
        <div>
          <strong>{{ (currentShop$ | async)?.marketplace | titlecase }}</strong>
        </div>
      </div>
      <div class="store-info">
        <div>Status</div>
        <div
          [ngClass]="{ connected: (currentShop$ | async)?.isConnected === true }"
        >
          <strong>
            {{
              (currentShop$ | async)?.isConnected === true
                ? 'Connected'
                : 'Not Connected'
            }}
          </strong>
        </div>
      </div>
    </div>

    <form [formGroup]="form">
      <div
        *ngFor="let attr of shipping.controls; let i = index"
        class="wrapper shipping-option"
      >
        <div class="logistic-name">
          <strong>{{ logistics[i].name }}</strong>
        </div>
        <div class="shipping-status">
          <input
            type="checkbox"
            [formControl]="attr"
            formArrayName="shipping"
          />
          <span>
            {{ logistics[i].enabled === true ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
      <button type="button" class="control secondary" (click)="onBack()">
        Previous
      </button>
      <button *ngIf="!readOnly.includes((currentShop$ | async)?.marketplace)"
        type="button"
        class="control"
        (click)="onSubmit()"
        [disabled]="isBusy"
      >
        Save
      </button>
    </form>
  `,
  styles: [
    `
      button:not(:first-child) {
        margin-left: 5px;
      }

      .store-info {
        flex: 1 1 auto;
        text-align: left;
      }

      .connected {
        color: var(--success) !important;
      }

      .wrapper {
        width: 60vw;
        display: flex;
        flex-direction: row;
        padding: 20px;
        border: solid 1px #e7e7e7;
        border-radius: 5px;
        margin-bottom: 20px;
      }

      .logistic-name {
        flex: 6 0px;
      }

      .shipping-status {
        flex: 1 0px;
      }
    `,
  ],
})
export class EditShippingComponent implements OnInit {
  form: FormGroup;
  shopSlug: string;
  currentShop$: Observable<IShop>;
  logistics: ILogistic[];
  isBusy: boolean;

  readOnly = [
    'tsc'
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
    this.route.data.subscribe((data: { logistics: ILogistic[] }) => {
      this.logistics = data.logistics;
      this.addCheckboxes();
    });
  }

  private initializeForm() {
    this.form = this.fb.group({
      shipping: this.fb.array([]),
    });
  }

  addCheckboxes() {
    const checkboxes = this.buildCheckboxes(this.logistics)
    if(checkboxes) {
      checkboxes.forEach((attr: FormControl) => {
        this.shipping.push(attr);
      });
    }
  }

  buildCheckboxes(attributes: ILogistic[]) {
    if(attributes) {
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
