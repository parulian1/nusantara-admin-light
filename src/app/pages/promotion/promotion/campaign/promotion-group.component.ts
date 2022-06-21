import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  PromotionCampaignService,
} from '@nusantara/services';
import { AbstractDetailComponent, Logger, ToastService } from '@nusantara/core';
import {
  IPromoGroup,
  IPromoGroupCombination,
} from '@nusantara/models';
import { DatePipe } from "@angular/common";

declare var window: any; // Needed on Angular 8+

const log = new Logger('ProductPromotionComponent');

@Component({
  selector: 'nus-product-promotion',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Promo Campaign">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Name</span>
        <input type="text" [formControl]="name" maxlength="50">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Description</span>
        <textarea [formControl]="description"></textarea>
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <div class="promo-date">
        <label class="promo-date-label">
          <span class="subtitle" i18n>Valid From</span>
          <span>{{ !!validFrom ? validFrom : '-' }}</span>
        </label>

        <label class="promo-date-label">
          <span class="subtitle" i18n>Valid To</span>
          <span>{{ !!validTo ? validTo : '-' }}</span>
        </label>
      </div>

      <label class="checkbox">
        <input type="checkbox" class="input-checkbox" [formControl]="isActive">
        <span i18n>Is Active</span>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label class="checkbox">
        <span class="subtitle" i18n>Priority</span>
        <input type="number" [formControl]="priority">
        <nus-field-errors [control]="priority"></nus-field-errors>
      </label>

      <label>
        <span class="subtitle" i18n>Image</span>
        <img *ngIf="imagePreviewUrl" [src]="imagePreviewUrl" alt="Banner Image" class="preview">
        <input type="file" [formControl]="banner" (change)="setImagePromoPreview($event)"
               name="bannerImage" accept="image/*">
        <nus-field-errors [control]="banner"></nus-field-errors>
      </label>

      <div class="promo-combination">
        <span class="upload-product">
          <h2 class="title-2" i18n>Combination</h2>
        </span>

        <table>
          <thead>
          <tr>
            <th i18n>Name</th>
            <th i18n>Type</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let promo of entity?.combinations; let i=index">
            <td>{{ promo.name }}</td>
            <td>{{ promo.type | promoTypeToLabel }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
  `,
  styles: [`
    .promo-date {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 30px;
    }

    .checkbox {
      padding: 10px 0;
      min-height: auto;
      width: fit-content
    }

    .promo-products, .promo-customer-groups {
      margin: 10px 0;
      display: flex;
      flex-direction: column;
    }

    .upload-product {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .upload-product button {
      display: flex;
      align-items: center;
    }


  `]
})
export class PromotionGroupComponent extends AbstractDetailComponent<IPromoGroup> implements OnInit, AfterViewInit {

  entity: IPromoGroup;
  imagePreviewUrl: string;

  hasProductUrl = false;

  validFrom: string;
  validTo: string;

  constructor(service: PromotionCampaignService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder,
              public datePipe: DatePipe) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeForm(entity?: IPromoGroup) {
    this.entity = entity;
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href, []],
      description: [entity?.description, []],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      priority: [entity?.priority ?? 1, [Validators.required]],
      banner: ['', []],
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();

    this.setImagePromoPreview(entity?.banner);

    if ((window.localStorage.getItem('site_domain') === 'marthatilaarshop.com') || (window.localStorage.getItem('site_domain') === 'www.marthatilaarshop.com')) {
      // TODO: Bad thing, should get this from API
      this.hasProductUrl = true;
    }

    this.updateValidDate(entity?.combinations);

  }

  setImagePromoPreview(data?: Event | string) {
    this.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  ngAfterViewInit() {
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get priority(): FormControl {
    return this.form.get('priority') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get banner(): FormControl {
    return this.form.get('banner') as FormControl;
  }

  save() {

    if (!!this.entity?.href && !!this.entity?.banner && !this.banner.value) {
      this.form.removeControl('banner');
    }

    if (!!this.banner && this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.banner = this.imagePreviewUrl;
    }

    super.save();
  }

  updateValidDate(combinations: IPromoGroupCombination[]): void {
    if (combinations.length) {
      this.validFrom = this.datePipe.transform(new Date(combinations.sort((oldPromo, newPromo) => {
        return new Date(oldPromo.validFrom).getTime() - new Date(newPromo.validFrom).getTime();
      })[0].validFrom), 'dd/MM/yyyy HH:mm:ss').toString();
      this.validTo = this.datePipe.transform(new Date(combinations.sort((oldPromo, newPromo) => {
        return new Date(newPromo.validTo).getTime() - new Date(oldPromo.validTo).getTime();
      })[0].validTo), 'dd/MM/yyyy HH:mm:ss').toString();
    } else {
      this.validFrom = null;
      this.validTo = null;
    }
  }

}

