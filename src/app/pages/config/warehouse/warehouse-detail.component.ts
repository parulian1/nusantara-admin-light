import { Component, OnInit } from '@angular/core';
import { AbstractDetailComponent, IChoiceFieldChoice, ToastService } from '@nusantara/core';
import { IWarehouse } from '@nusantara/models';
import { WarehouseService } from '@nusantara/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { IHyperlinkedEntity } from '@nusantara/models/base';

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

      <label>Type
        <select formControlName="type">
          <option *ngFor="let opt of types" [ngValue]="opt.value">
            {{opt.displayName}}
          </option>
        </select>
      </label>

      <label>
        <span>Financial Reporting As</span>
        <select formControlName="internalNotes">
          <option *ngFor="let wh of warehouses" [ngValue]="wh.href">
            {{ wh.name }}
          </option>
        </select>
      </label>

      <label>
        <span>Internal Notes</span>
        <textarea formControlName="internalNotes"></textarea>
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
export class WarehouseDetailComponent extends AbstractDetailComponent<IWarehouse> implements OnInit {

  types: Array<IChoiceFieldChoice>;
  warehouses: Array<{href: string, name: string}>;

  constructor(public service: WarehouseService,
              public router: Router,
              public route: ActivatedRoute,
              public fb: FormBuilder,
              public toast: ToastService) { super(); }

  ngOnInit() {
    super.ngOnInit();
    this.route.data.subscribe((data: {types: IChoiceFieldChoice[]}) => {
      this.types = data.types;

      this.warehouses = [{href: null, name: '---'}, ];

    });
  }

  initializeForm(entity?: IWarehouse) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, ]],
      code: [entity?.code, [Validators.required, ]],
      href: [entity?.href, []],
      type: [entity?.type, []],
      internalNotes: [entity?.internalNotes, []],
      financialReportingAs: [entity?.financialReportingAs, []]
    });
  }

}

