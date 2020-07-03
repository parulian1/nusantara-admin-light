import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IChoiceFieldChoice, ToastService } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { ICategory, IInventoryReceiving, IProductClass, IVendor, IWarehouse } from '@nusantara/models';
import { PagedResponse } from '@nusantara/core/pagination';

@Component({
  selector: 'nus-inventory-receiving',
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Warehouse</span>
        <select>
          <option></option>
        </select>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
  `,
  styles: [ ]
})
export class ReceivingComponent extends AbstractDetailComponent<IInventoryReceiving> implements OnInit {

  warehouses: IWarehouse[];

  constructor(private fb: FormBuilder,
              public toast: ToastService,
              public route: ActivatedRoute,
              public router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: { warehouses: IWarehouse[]}) => {
      this.warehouses = data.warehouses;
    });
  }

  initializeForm(entity?: IInventoryReceiving) {

  }

}
