import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AbstractDetailComponent } from '@nusantara/core';
import { ContentFooterService } from '@nusantara/services';
import { IContentFooter, IFlatPage, IRelativeChoices } from '@nusantara/models';
import { ToastLevelEnum, ToastService } from '@nusantara/core/toast';

@Component({
  selector: 'nus-content-footer',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Page">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span>Title</span>
        <input type="text" [formControl]="title">
        <nus-field-errors [control]="title"></nus-field-errors>
      </label>

      <label>
        <span>URL Path</span>
        <input type="text" [formControl]="url">
        <nus-field-errors [control]="url"></nus-field-errors>
      </label>

      <label>
        <span>Page</span>
        <select [formControl]="page" name="page">
          <option value=""><i>-- set an empty --</i></option>
          <option *ngFor="let page of flatPages"
                  [ngValue]="page.href">
            {{ page.title }}
          </option>
        </select>
        &nbsp;
        <span style="font-size: 13px;">(* If you set a page, than url field will ignored</span>
      </label>

      <label>
        <span>Position</span>
        <select [formControl]="position" name="position">
          <option value=""><i>-- set an empty --</i></option>
          <option *ngFor="let position of positionChoices"
                  [ngValue]="position.key">
            {{ position.name }}
          </option>
        </select>
      </label>

      <label>
        <span>Relative to</span>
        <select [formControl]="relativeTo" name="relativeTo">
          <option *ngFor="let relTo of relativeToChoices"
                  [ngValue]="relTo.href"
                  [innerHTML]="relTo.displayName">
          </option>
        </select>
      </label>

      <label class="toggle">
        <input type="checkbox"
               class="toggle"
               [formControl]="isActive"
               name="is-active"/>
        <span>Is Active</span>
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>

    <nus-content-footer-children
      *ngIf="entity"
      [children]="children">
    </nus-content-footer-children>
  `,
  styles: [``],
})
export class ContentFooterComponent extends AbstractDetailComponent<IContentFooter> implements OnInit {
  flatPages: IFlatPage[] = [];
  entity: IContentFooter;
  children: IContentFooter[] = [];

  positionChoices = [
    { name: 'First of Child', key: 'first-child' },
    { name: 'Right', key: 'right' },
    { name: 'Left', key: 'left' },
  ];
  relativeToChoices: IRelativeChoices[] = [];

  constructor(service: ContentFooterService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {entity: IContentFooter, flatPages: IFlatPage[], relativeChoices: IRelativeChoices[]}) => {
      this.entity = data.entity || null;
      this.children = data.entity?.children || [];

      this.flatPages = data.flatPages;
      this.relativeToChoices = data.relativeChoices;
    });
  }

  setOriginalEntityName(entity?: IContentFooter) {
    if (!!entity && entity.hasOwnProperty('title')) {
      // tslint:disable:no-string-literal
      this.originalEntityName = entity.title;
    }
  }

  get title(): FormControl { return this.form.get('title') as FormControl; }
  get url(): FormControl { return this.form.get('url') as FormControl; }
  get position(): FormControl { return this.form.get('position') as FormControl; }
  get relativeTo(): FormControl { return this.form.get('relativeTo') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get page(): FormControl { return this.form.get('page') as FormControl; }

  initializeForm(entity?: IContentFooter) {
    this.form = this.fb.group({
      title: [entity?.title, [Validators.required]],
      href: [entity?.href],
      url: [entity?.displayUrl],
      position: [entity?.position, [Validators.required]],
      relativeTo: [entity?.relativeTo],
      isActive: [entity?.isActive ?? true, [Validators.required]],
      page: [entity?.page],
    });

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();
  }

  protected onDeleteSuccess() {
    this.form.enable();
    this.toast?.addMessage(`"${this.form.get('title').value}" was deleted successfully.`, 'Deleted', ToastLevelEnum.success);
    this.navigateToParent(false);
  }
}
