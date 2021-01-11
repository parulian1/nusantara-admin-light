import { Component, OnInit } from '@angular/core';
import {AbstractDetailComponent, ToastService} from '../../../core';
import {IAuthSocial} from '../../../models/auth-social';
import {AuthSocialService} from '../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {drf} from '../../../models';

@Component({
  selector: 'nus-auth-social',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      [typeName]="entityTypeName">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <label>
        <span>Type</span>
        <select [formControl]="authType">
          <option *ngFor="let opt of authTypeChoice" [value]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
        <nus-field-errors [control]="authType"></nus-field-errors>
      </label>

      <label>
        <span>App KEY</span>
        <input type="text" [formControl]="appKey" name="appKey">
        <nus-field-errors [control]="appKey"></nus-field-errors>
      </label>
      <label>
        <span>App Secret</span>
        <input type="text" [formControl]="appSecret" name="appSecret">
        <nus-field-errors [control]="appSecret"></nus-field-errors>
      </label>
      <label>
        <span>Is Active</span>
        <input type="checkbox" [formControl]="isActive" name="isActive">
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [
  ]
})
export class AuthSocialComponent extends AbstractDetailComponent<IAuthSocial> implements OnInit{

  entity?: IAuthSocial;
  authTypeChoice: drf.IChoice[];

  constructor(service: AuthSocialService,
              router: Router,
              route: ActivatedRoute,
              public fb: FormBuilder,
              toast: ToastService) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {

    this.route.data.subscribe((data: { authType: drf.IChoice[] }) => {
      this.authTypeChoice = data.authType;
    });
    super.ngOnInit();
  }

  get authType(): FormControl {
    return this.form.get('authType') as FormControl;
  }

  get appKey(): FormControl {
    return this.form.get('appKey') as FormControl;
  }

  get appSecret(): FormControl {
    return this.form.get('appSecret') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  initializeForm(entity: IAuthSocial) {
    this.form = this.fb.group({
      authType: [entity?.authType, [Validators.required, ]],
      href: [entity?.href, []],
      appKey: [entity?.appKey, [Validators.required, ]],
      appSecret: [entity?.appSecret, []],
      isActive: [entity?.isActive, []]
    });

    this.entity = entity;
  }

}
