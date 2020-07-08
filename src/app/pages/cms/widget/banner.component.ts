import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { IWidget } from '@nusantara/models';
import { WidgetService } from '@nusantara/services';

@Component({
  selector: 'nus-flat-page',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Widget">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" [formControl]="name">
        <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error-detail">
          <div *ngIf="name.errors.required">Name is required</div>
          <div *ngIf="name.errors.apiError">{{ name.getError('apiError') }}</div>
        </div>
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
export class WidgetComponent extends AbstractDetailComponent<IWidget> implements OnInit {

  constructor(public service: WidgetService,
              public fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }

  initializeForm(entity?: IWidget) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
    });
  }
}
