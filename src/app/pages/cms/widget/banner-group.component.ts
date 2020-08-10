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
        <span>Name</span>
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option [ngValue]="null">---</option>
          <option *ngFor="let t of bannerGroupTypes" [ngValue]="t.value">{{ t.displayName }}</option>
        </select>
      </label>


      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew">Delete</button>
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

  constructor(public service: WidgetService,
              public fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
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
