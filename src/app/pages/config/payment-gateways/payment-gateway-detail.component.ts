import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService, AbstractDetailComponent } from '@nusantara/core';
import { INamedHrefEntity } from '@nusantara/models/base';
import { drf, IPaymentGateway } from '@nusantara/models';
import { PaymentGatewayService } from '@nusantara/services';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'nus-payment-gateway',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Payment Gateway">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <label>
        <span>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span>Logo</span>
        <img [src]="logoPreviewUrl" alt="Payment Gateway Logo" class="preview">
        <small>Recommended: A size</small>
        <input type="file"
               [formControl]="logo"
               (change)="setLogoPreview($event)"
               name="logo"
               accept="image/*">
      </label>


      <label>
        <span>Type</span>
        <select [formControl]="type">
          <option *ngFor="let opt of typeChoices" [value]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="type"></nus-field-errors>
      </label>

      <label>
        <span>Client Key</span>
        <input type="text" [formControl]="clientKey" name="clientKey">
        <nus-field-errors [control]="clientKey"></nus-field-errors>
      </label>

      <label>
        <span>Server Key</span>
        <input type="text" [formControl]="serverKey" name="serverKey">
        <nus-field-errors [control]="serverKey"></nus-field-errors>
      </label>

      <div>
        <label for="description" class="external"><span>Description</span></label>
        <ckeditor [editor]="Editor"
                  [formControl]="description" id="description"></ckeditor>
        <nus-field-errors [control]="description"></nus-field-errors>
      </div>
      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
    '.ck-editor__main { min-height: 150px; }',
  ]
})
export class PaymentGatewayDetailComponent extends AbstractDetailComponent<IPaymentGateway> implements OnInit {

  public Editor = ClassicEditor;

  logoPreviewUrl: string;
  typeChoices: drf.IChoice[];

  constructor(public service: PaymentGatewayService,
              public fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get logo(): FormControl {
    return this.form.get('logo') as FormControl;
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get clientKey(): FormControl {
    return this.form.get('clientKey') as FormControl;
  }

  get serverKey(): FormControl {
    return this.form.get('serverKey') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: { typeChoices: drf.IChoice[] }) => {
      this.typeChoices = data.typeChoices;
    });
    super.ngOnInit();
  }

  initializeForm(entity?: IPaymentGateway) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      logo: [''],
      type: [entity?.type, [Validators.required]],
      clientKey: [entity?.clientKey],
      serverKey: [entity?.serverKey],
      description: [entity?.description]
    });

    this.setLogoPreview(entity?.logo);
  }

  setLogoPreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => {
        this.logoPreviewUrl = dataAsUrl;
        this.form.value.logo = dataAsUrl;
      }
    );
  }
}
