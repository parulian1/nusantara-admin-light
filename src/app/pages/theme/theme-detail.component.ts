import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'iso8601-duration';

import { AbstractDetailComponent, ErrorResult, ToastService } from '@nusantara/core';
import { themes, drf } from '@nusantara/models';
import { ThemeService } from '@nusantara/services';
import { ThemeMediaHostComponent } from './media';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { IError } from '@nusantara/models/base/error';
import { of } from 'rxjs';

@Component({
  selector: 'nus-theme-detail',
  template: `
    <h1 class="title-1">Theme Details</h1>

    <ul class="non-field-errors">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <label>
        <span>Themes Name*</span>
        <input type="text" formControlName="name">
      </label>

      <label>
        <span>Is Active?</span>
        <input type="checkbox" formControlName="isActive">
      </label>

      <label>
        <span>Subscription Type*</span>
        <select formControlName="subscriptionType">
          <option *ngFor="let opt of typeChoices" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
      </label>

      <label>
        <span>Price</span>
        <input type="number" formControlName="price">
      </label>

      <label>
        <span>Themes Description*</span>
        <textarea formControlName="description" rows="3"></textarea>
      </label>

      <nus-theme-media-host [form]="media"></nus-theme-media-host>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
      </div>
    </form>
  `,
  styles: [
    'label { display: block; }',
    '.hidden { display: none; }',
  ]
})
export class ThemeDetailComponent extends AbstractDetailComponent<themes.ITheme> implements OnInit {

  typeChoices: drf.IChoice[] = [];

  @ViewChild(ThemeMediaHostComponent) mediaHost!: ThemeMediaHostComponent;

  constructor(service: ThemeService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder) {
    super(route, router, toast, service);
  }

    get name(): FormControl { return this.form.get('name') as FormControl; }
    get href(): FormControl { return this.form.get('href') as FormControl; }
    get subscriptionType(): FormControl { return this.form.get('subscriptionType') as FormControl; }
    get price(): FormControl { return this.form.get('price') as FormControl; }
    get description(): FormControl { return this.form.get('description') as FormControl; }
    get media(): FormArray { return this.form.get('media') as FormArray; }
    get isActive(): FormControl { return this.form.get('isActive') as FormControl; }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {typeChoices: drf.IChoice[]}) => {
      this.typeChoices = data.typeChoices;
    });
  }

  initializeForm(entity?: themes.ITheme) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      href: [entity?.href, []],
      subscriptionType: [entity?.subscriptionType, [Validators.required]],
      price: [entity?.price, ],
      description: [entity?.description, ],
      media: this.fb.array([]),
      isActive: [entity?.isActive, [Validators.required, ]],
    });
  }

  initializeSubViewForms(entity?: themes.ITheme) {
    for (const media of entity?.media ?? []) {
      this.mediaHost.add(media);
    }
  }

  /**
   * Overridden implementation: This form hosts several sub-views, which must
   * be saved separate of the main product:  Because of that, the data
   * must be deleted from the data we pass to the product service.
   */
  getFormValue(): any {
    const formValue = {};
    Object.assign(formValue, this.form.value);
    // delete sub entities that shouldn't be saved on the primary object
    // like price-lists, media, dll.
    delete (formValue as themes.ITheme).media;
    return formValue;
  }

  submit() {
    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(resp => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp);
        } else if (this.mediaHost.entities.length > 0){
          this.mediaHost.saveAll(resp.entity).subscribe(() => {
            this.navigateToParent(false);
          });
        } else {
          this.navigateToParent(false);
        }
      }
    );
    this.form.disable();

  }

}
