import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AbstractEditingComponent, IResultResponse } from '@nusantara/core';
import { products, drf } from '@nusantara/models';
import { ProductSubscriptionService } from '@nusantara/services';
import { Observable, zip } from 'rxjs';

@Component({
  selector: 'nus-product-subscription',
  template: `
    <div [formGroup]="form" class="product-dimension">
      <label>
        <span i18n>Packet*</span>
        <select [formControl]="packet">
          <option *ngFor="let opt of packetChoices" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="packet"></nus-field-errors>
      </label>
      <label>
        <span i18n>Subscription duration*</span>
        <select [formControl]="duration">
          <option *ngFor="let opt of durationChoices" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="duration"></nus-field-errors>
      </label>
      <label>
        <span i18n>Subscription length*</span>
        <select [formControl]="length">
          <option *ngFor="let opt of lengthChoices" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="length"></nus-field-errors>
      </label>
    </div>
  `,
  styles: [
    '.product-dimension { display: grid; grid-template-columns: repeat(3, 1fr); grid-column-gap: 16px; }',
  ]
})
export class ProductSubscriptonHostComponent extends AbstractEditingComponent implements OnInit {

  // @Input() form: FormGroup;

  subscription: Array<products.IProductSubscription> = [];
  entity: products.IProductSubscription;
  packetChoices: drf.IChoice[] = [];
  durationChoices: drf.IChoice[] = [];
  lengthChoices: drf.IChoice[] = [];

  constructor(
    protected service: ProductSubscriptionService,
    protected route: ActivatedRoute,
    protected fb: FormBuilder) {
      super();
    }

  get packet(): FormControl { return this.form.get('packet') as FormControl; }
  get price(): FormControl { return this.form.get('price') as FormControl; }
  get duration(): FormControl { return this.form.get('duration') as FormControl; }
  get length(): FormControl { return this.form.get('length') as FormControl; }

  ngOnInit() {
    this.initializeForm(this.entity);
    this.route.data.subscribe((data: {
      subscriptionPacket: drf.IChoice[],
      subscriptionDuration: drf.IChoice[],
      subscriptionLength: drf.IChoice[]
    }) => {
      this.packetChoices = data.subscriptionPacket;
      this.durationChoices = data.subscriptionDuration;
      this.lengthChoices = data.subscriptionLength;
    });
  }

  /**
   * Configures the form that is edited in this component.
   *
   * Special notes related to the ProductComponent:
   * 1. There is differing logic depending on whether we're initializing a parent or a child (variant)
   * 2. From a parent, the variants array is READ-ONLY at the API, so we DO NOT set it on this form.
   */
  initializeForm(entity?: products.IProductSubscription) {
    this.form = this.fb.group({
      packet: [entity?.packet, [Validators.required]],
      href: [ entity?.href, [] ],
      duration: [entity?.duration, [Validators.required]],
      length: [entity?.length, [Validators.required]],
    });
  }

  add(entity?: products.IProductSubscription) {
    this.form = this.fb.group({
      packet: [entity?.packet, [Validators.required]],
      href: [entity?.href, []],
      duration: [entity?.duration, [Validators.required]],
      length: [entity?.length, [Validators.required]],
      product: [entity?.product, []],
    });
  }

  /**
   *
   * @param product The parent product which should own all the images and videos.
   */
  save(product: products.IProductSubscription): Observable<IResultResponse[]> {
    this.subscription.push(this.form.value);

    // make sure subscription have the product href set
    this.subscription.forEach((value) => { value.product = product.href; });

    // submit all changes to the API and an observable of all responses
    return zip(
      ...this.subscription.map(value => this.service.save(value))
    );
  }

}
