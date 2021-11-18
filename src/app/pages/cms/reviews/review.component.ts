import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AbstractDetailComponent, ToastLevelEnum, ToastService } from '@nusantara/core';
import { IReview } from '@nusantara/models';
import { ReviewService } from '@nusantara/services';

@Component({
  selector: 'nus-review',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Reviews">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span i18n>Title</span>
        <input type="text" [formControl]="title">
        <nus-field-errors [control]="title"></nus-field-errors>
      </label>


      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [``]
})
export class ReviewComponent extends AbstractDetailComponent<IReview> implements OnInit {

  constructor(service: ReviewService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get title(): FormControl { return this.form.get('title') as FormControl; }

  initializeForm(entity?: IReview) {
    this.form = this.fb.group({
      // title: [entity?.title, [Validators.required]],
    });
  }
}
