import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import { AuthService } from '@nusantara/auth/auth.service';
import {MarketplaceShopService} from '@nusantara/services';

import { ErrorResult } from '@nusantara/core/responses';
import { IError } from '@nusantara/models/base/error';

/**
 * Allows the user to authenticate with an email address and password.
 * If authentication is successful, the user will automatically be
 * redirected to '/' or to the URL specified by the 'next' query parameter.
 */
@Component({
  selector: 'nus-callback',
  template: `
    <form [formGroup]="form" (ngSubmit)="callback()">
      <input type="hidden" [formControl]="code">
      <h3 style="text-align: center">Please Confirm {{marketplace | titlecase}} and Bhisma Authorization</h3>
      <h3 style="text-align: center">This process will takes times</h3>
      <h3 style="text-align: center">Please wait and refresh your store list page until the status is connected</h3>
      <div class="controls-container">
        <button type="submit" [disabled]="!form.valid || isBusy" class="control">
          <span>Confirm</span>
        </button>
      </div>

    </form>
  `,
  styles: [`
    :host {
      padding-left: 33px;
      padding-right: 33px;
      display: block;
    }
    h1 { display: none; }

    nav {
      padding-top: 50px;
      padding-bottom: 5px;
      text-align: center;
    }
    a { text-decoration: none; }
  `]
})
export class CallbackComponent implements OnInit {

  form: FormGroup;
  nonFieldErrors: Array<string> = [];
  afterLoginUrl: string;
  isBusy = false;
  codeCallback: any;
  redirectOnFail = '/auth/login';
  siteDomain = this.auth.siteDomain;
  marketplace: string;

  // add new marketplace that need code
  marketplaceArray = ['lazada', 'bukalapak']

  constructor(private fb: FormBuilder,
              private service: MarketplaceShopService,
              private router: Router,
              public auth: AuthService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    // needed to check marketplace, now only bukalapak and lazada
    this.marketplace = this.activatedRoute.snapshot.paramMap.get('marketplace');
    
    this.activatedRoute.queryParams.subscribe(params => {
        this.codeCallback = params['code'];
    });

    this.form = this.fb.group({
      code: [this.codeCallback, [Validators.required]],
      marketplace: [this.marketplace, []],
    });

    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      this.afterLoginUrl = paramMap.get('next') ?? '/config/marketplace-integration/connect';
    });
  }

  /**
   * Attempts to log the user in.
   * If successful, their auth token will be saved and they will be redirected.
   */

  getFormValue(): any {
    const formValue = {
      code: this.form.value.code,
      marketplace: this.form.value.marketplace,
    };
    return formValue;
  }
  get code(): FormControl { return this.form?.get('code') as FormControl; }

  callback() {

    this.nonFieldErrors.length = 0;
    this.isBusy = true;

    if(this.auth.isAuthenticated){
      this.service
          .shopInAuthCallback(this.getFormValue())
          .subscribe(result => {
             if (result instanceof ErrorResult) {
               this.onLoginFail(result.errorDetails);
             } else {
               this.onLoginSuccess();
             }
          });
      this.form.disable();
    } else {
      this.service
          .shopCallback(this.getFormValue(), this.siteDomain)
          .subscribe(result => {
             if (result instanceof ErrorResult) {
               this.onLoginFail(result.errorDetails);
             } else {
               this.onLoginSuccess();
             }
          });

      this.auth.logout();
      this.router.navigate([this.redirectOnFail, ], {queryParams: {next: '/config/marketplace-integration/connect'}});
      return false;
    }
  }

  private onLoginSuccess() {
    this.form.enable();
    this.router.navigateByUrl(decodeURIComponent(this.afterLoginUrl));
  }

  private onLoginFail(errorDetails: IError) {
    this.isBusy = false;
    this.form.enable();

    errorDetails.details.forEach((error) => {
      this.form.controls[error.field].setErrors({
        apiError: error.message
      });
    });
    this.nonFieldErrors.push(errorDetails.message);
  }
}
