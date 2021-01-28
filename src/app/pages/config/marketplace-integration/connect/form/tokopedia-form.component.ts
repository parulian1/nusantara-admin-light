import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { MarketplaceClientService } from '@nusantara/services';

@Component({
  selector: 'nus-tokopedia-form',
  template: `
    <form [formGroup]="form">
      <label>
        <span>Partner ID</span>
        <input type="text" formControlName="partner_id" />
      </label>

      <label>
        <span>Partner Key</span>
        <input type="text" formControlName="partner_key" />
      </label>

      <label>
        <span>Shop ID</span>
        <input type="text" formControlName="shop_id" />
      </label>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Connect</button>
      </div>
    </form>
  `,
  styles: [``],
})
export class TokopediaClientFormComponent
  extends AbstractDetailComponent<any>
  implements OnInit {
  form: FormGroup;

  constructor(
    public service: MarketplaceClientService,
    public router: Router,
    public route: ActivatedRoute,
    public fb: FormBuilder,
    public toast: ToastService
  ) {
    super(route, router, toast, service);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  initializeForm(entity?: any) {
    this.form = this.fb.group({
      partner_id: [entity?.partnerId, [Validators.required]],
      partner_key: [entity?.partnerKey, [Validators.required]],
      shop_id: [entity?.shopId, [Validators.required]],
    });
  }
}
