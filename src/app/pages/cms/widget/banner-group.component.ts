import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { IWidget } from '@nusantara/models';
import { WidgetService } from '@nusantara/services';
import { BannerGroupType } from '../../../models/widgets/banner-group.type';
import { IChoice } from '../../../models/drf';

@Component({
  selector: 'nus-flat-page',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Banner Group">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Name</span>
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Type</span>
        <select [formControl]="type">
          <option [ngValue]="null">---</option>
          <option *ngFor="let t of bannerGroupTypes" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
      </label>


      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid" i18n>Save</button>
        <button type="button" (click)="navigateToParent(true)" i18n>Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew" i18n>Delete</button>
      </div>
    </form>
  `,
  styles: [ ]
})
export class BannerGroupComponent extends AbstractDetailComponent<IWidget> implements OnInit {

  // todo: this should be refactored to fetch from API later.
  bannerGroupTypes: Array<IChoice> = [
    { value: 'standard', displayName: 'Standard' },
    { value: 'up_next', displayName: 'Up-Next' },
    { value: 'standard_with_mini', displayName: 'Standard with Mini' },
  ];

  constructor(service: WidgetService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get type(): FormControl { return this.form.get('type') as FormControl; }

  initializeForm(entity?: IWidget) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
    });
  }
}
