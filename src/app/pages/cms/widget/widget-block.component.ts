import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastService } from '@nusantara/core';
import { AbstractDetailComponent } from '@nusantara/core/components';
import { IWidget, IWidgetBlock } from '@nusantara/models/widgets';
import { WidgetService } from '@nusantara/services';
import { IChoice } from '../../../models/drf';

@Component({
  selector: 'nus-widget-block',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Widget">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">

      <label>
        <span i18n>Name</span>
        <input type="text" [formControl]="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Sort Priority</span>
        <input type="number" [formControl]="sortPriority">
        <nus-field-errors [control]="sortPriority"></nus-field-errors>
      </label>

      <label>
        <span i18n>Shell Section</span>
        <select [formControl]="shellSection">
          <option *ngFor="let c of shellSections" [ngValue]="c.value">{{c.displayName}}</option>
        </select>
      </label>

      <label>
        <span i18n>URL Path</span>
        <input type="text" [formControl]="urlPath">
        <nus-field-errors [control]="urlPath"></nus-field-errors>
      </label>


      <table>
        <thead>
        <tr>
          <th i18n>Name</th>
          <th i18n>Type</th>
          <th i18n>Is Active</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <nus-widget-summary-row
          *ngFor="let widget of widgets.controls"
          [form]="widget">
        </nus-widget-summary-row>
        </tbody>
      </table>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
  `,
  styles: [ ]
})
export class WidgetBlockComponent extends AbstractDetailComponent<IWidgetBlock> implements OnInit {

  // todo: should come from API
  shellSections: Array<IChoice> = [
    { value: '', displayName: 'Body' },
    { value: 'header', displayName: 'Header' },
    { value: 'footer', displayName: 'Footer' },
  ];

  constructor(service: WidgetService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get sortPriority(): FormControl { return this.form.get('sortPriority') as FormControl; }
  get urlPath(): FormControl { return this.form.get('urlPath') as FormControl; }
  get shellSection(): FormControl { return this.form.get('shellSection') as FormControl; }
  get widgets(): FormArray { return this.form.get('widgets') as FormArray; }

  initializeForm(entity?: IWidgetBlock) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required]],
      href: [entity?.href],
      sortPriority: [entity?.sortPriority ?? 0, [Validators.required, Validators.min(0)]],
      urlPath: [entity?.urlPath ?? '', [Validators.required]],
      shellSection: [entity?.shellSection ?? '', [Validators.required, ]],
      widgets: this.fb.array([]),
    });

    for (const widget of entity?.widgets ?? []) {
      this.addWidget(widget);
    }
  }

  addWidget(widget?: IWidget) {
    const widgetForm = this.fb.group({
      href: [widget?.href, []],
      name: [widget?.name, []],
      block: [widget?.block, []],
      contentType: this.fb.group({
        href: [widget?.contentType.href, []],
        appLabel: [widget?.contentType.appLabel, []],
        model: [widget?.contentType.model, []]
      }),
      contentObject: this.fb.group([]),
      objectId: [widget?.objectId, []],
      isActive: [widget?.isActive, []],
      sortPriority: [widget?.sortPriority, []]
    });
    this.widgets.push(widgetForm);
  }
}
