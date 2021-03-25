import {Component, OnInit} from '@angular/core';
import {AbstractDetailComponent, ToastService} from '@nusantara/core';
import {IConfigCartDiscount} from '@nusantara/models/config-cart-discount';
import {ConfigCartDiscountService} from '@nusantara/services/config-cart-discount.service';
import {FormBuilder, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-config-cart-discount',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">
<!--      <label class="checkbox">-->
<!--        <span>Open Discount</span>-->
<!--        <input type="checkbox" [formControl]="openDiscount">-->
<!--      </label>-->
      <input type="checkbox" class="toggle" [formControl]="openDiscount"/>

      <p>Activating cart discount will allow offline customers to get additional discount </p>

      <nus-detail-actions
        [component]="this"
        [hideDelete]="true"
        (cancel)="navigateToParent(true)">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class ConfigCartDiscountComponent extends AbstractDetailComponent<IConfigCartDiscount> implements OnInit {
  entity?: IConfigCartDiscount;

  constructor(service: ConfigCartDiscountService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) { super(route, router, toast, service); }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { entity: IConfigCartDiscount }) => {
      this.entity = data.entity;
    });
    this.originalEntityName = 'Config Cart Discount';
  }

  get openDiscount(): FormControl { return this.form.get('openDiscount') as FormControl; }

  initializeForm(entity?: IConfigCartDiscount) {
    this.entity = entity;
    this.form = this.fb.group({
      href: [entity?.href],
      openDiscount: [entity?.openDiscount ?? false],
    });
    // need to mark as touched to make custom styling works
    this.form.controls.openDiscount.markAsTouched();
  }
}
