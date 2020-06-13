import { Component, OnInit } from '@angular/core';
import { AbstractDetailComponent, ToastService } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'nus-warehouse-detail',
  template: `
    <nus-detail-title
        [originalName]="originalEntityName"
        [typeName]="entityTypeName">
    </nus-detail-title>

    <ul class="non-field-errors" *ngIf="!!nonFieldErrors.length">
      <li *ngFor="let err of nonFieldErrors">{{ err }}</li>
    </ul>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span>Name</span>
        <input type="text" formControlName="name">
      </label>

      <label>
        <span>Code</span>
        <input type="text" formControlName="code">
      </label>

      <div class="actions-container">
        <button type="submit" [disabled]="!form.valid">Save</button>
        <button type="button" (click)="navigateToParent(true)">Cancel</button>
        <button type="button" (click)="delete()" *ngIf="!isNew">Delete</button>
      </div>
    </form>
  `,
  styles: [``]
})
export class WarehouseDetailComponent extends AbstractDetailComponent<IWarehouse> {

  constructor(public service: WarehouseService,
              public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              public toast: ToastService) { super(); }

  initializeForm(entity?: IWarehouse) {
    throw new Error("Method not implemented.");
  }

}

