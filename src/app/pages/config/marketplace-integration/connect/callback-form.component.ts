import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceClientService } from '@nusantara/services';
import {IClient, IShopeeAuthResponse, IShopeeCredential} from '@nusantara/models';
import { Observable } from 'rxjs';
import { MarketplaceClientEnum } from './markeplace-client-enum';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'nus-marketplace-integration',
  template: `
    <h1 class="title-1">Add Store</h1>
    <div class="wrapper">
      <h1 class="heading-1">Connect to Marketplace</h1>
      <p>Connect to manage products in marketplace.</p>

      <form [formGroup]="form" class="fluid">
      <label>
        <span>Callback Code
        </span>
        <input formControlName="callbackCode"/>
        <nus-field-errors-marketplace
          [control]="callbackCode"
          variable="Callback Code"
        ></nus-field-errors-marketplace>
      </label>

    </form>
    </div>
  `,
  styles: [
    `.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; width: 60vw; }`,
    'p { color: var(--darken-grey); }',
    'form { margin-top: 16px; }',
    'label { margin-bottom: 16px; padding: 0; }'
  ],
})
export class CallbackFormComponent implements OnInit {
  form: FormGroup;
  selectedMarketplace: string;
  shopSlug: string = null;
  editMode = false;
  marketplaceClient = MarketplaceClientEnum;
  code: any;

  constructor(
    private service: MarketplaceClientService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {this.initializeForm();}

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.code = params['code'];
      });
      this.fillValue()
    }

    get callbackCode(): FormControl {
      return this.form.get('callbackCode') as FormControl;
    }

    initializeForm() {
      this.form = this.fb.group({
        callbackCode: [this.code, [Validators.required]],
      });
    }

    fillValue(){
      if (this.code != null) {
          this.form.patchValue({
            callbackCode: this.code,
          });
        }
    }
}
