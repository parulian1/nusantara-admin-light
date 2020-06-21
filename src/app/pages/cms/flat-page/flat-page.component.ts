import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { IFlatPage } from '@nusantara/models';
import { ProductClassService, ProductAttributeService } from '@nusantara/services';

@Component({
  selector: 'nus-flat-page',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Page">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Title</span>
        <input type="text" [formControl]="title">
        <div *ngIf="title.invalid && (title.dirty || title.touched)" class="error-detail">
          <div *ngIf="title.errors.required">Title is required</div>
          <div *ngIf="title.errors.apiError">{{ title.getError('apiError') }}</div>
        </div>
      </label>

      <label>
        <span>URL Path</span>
        <input type="text" [formControl]="url">
        <div *ngIf="url.invalid && (url.dirty || url.touched)" class="error-detail">
          <div *ngIf="url.errors.required">URL is required</div>
          <div *ngIf="url.errors.apiError">{{ url.getError('apiError') }}</div>
        </div>
      </label>

      <label>
        <span>Content</span>
        <textarea [formControl]="content"></textarea>
        <div *ngIf="content.invalid && (content.dirty || content.touched)" class="error-detail">
          <div *ngIf="content.errors.required">Content is required</div>
          <div *ngIf="content.errors.apiError">{{ content.getError('apiError') }}</div>
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
export class FlatPageComponent extends AbstractDetailComponent<IFlatPage> implements OnInit {

  constructor(public service: ProductClassService,
              private attributeService: ProductAttributeService,
              private fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get url(): FormControl { return this.form.get('url') as FormControl; }
  get href(): FormControl { return this.form.get('href') as FormControl; }
  get title(): FormControl { return this.form.get('title') as FormControl; }
  get content(): FormControl { return this.form.get('content') as FormControl; }

  initializeForm(entity?: IFlatPage) {
    this.form = this.fb.group({
      title: [entity?.title, [Validators.required]],
      href: [entity?.href],
      url: [entity?.url, [Validators.required]],
      content: [entity?.content, [Validators.required]],
    });
  }

  setOriginalEntityName(entity?: IFlatPage) {
    this.originalEntityName = entity.title;
  }
}
