import {Component, OnInit} from '@angular/core';
import {AbstractDetailComponent, ToastLevelEnum, ToastService} from '@nusantara/core';
import {IContentFooter, IFlatPage, INavigation, IRelativeChoices} from '@nusantara/models';
import {NavigationService} from '@nusantara/services/navigation.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'nus-navigation',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Header Navigation">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()">
      <label>
        <span i18n>Title</span>
        <input type="text" [formControl]="title">
        <nus-field-errors [control]="title"></nus-field-errors>
      </label>

      <label>
        <span i18n>URL Path</span>
        <input type="text" [formControl]="url">
        <nus-field-errors [control]="url"></nus-field-errors>
      </label>

      <label>
        <span i18n>Page</span>
        <select [formControl]="page" name="page">
          <option value=""><i>-- set an empty --</i></option>
          <option *ngFor="let page of flatPages"
                  [ngValue]="page.href">
            {{ page.title }}
          </option>
        </select>
        &nbsp;
        <span style="font-size: 13px;" i18n>(* If you set a page, than url field will ignored</span>
      </label>

      <label>
        <span i18n>Position</span>
        <select [formControl]="position" name="position">
          <option value=""><i>-- set an empty --</i></option>
          <option *ngFor="let position of positionChoices"
                  [ngValue]="position.key">
            {{ position.name }}
          </option>
        </select>
      </label>

      <label>
        <span i18n>Relative to</span>
        <select [formControl]="relativeTo" name="relativeTo">
          <option *ngFor="let relTo of relativeToChoices"
                  [ngValue]="relTo.href"
                  [innerHTML]="relTo.displayName">
          </option>
        </select>
      </label>

      <label class="checkbox">
        <span i18n>Is Active</span>
        <input type="checkbox" [formControl]="isActive">
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>
    </form>
    <nus-navigation-children *ngIf="entity"
                             [children]="children">
    </nus-navigation-children>
  `
})
export class NavigationComponent extends AbstractDetailComponent<INavigation> implements OnInit {
  flatPages: IFlatPage[] = [];
  entity: INavigation;
  children: INavigation[] = [];
  positionChoices = [
    {name: 'First of Child', key: 'first-child'},
    {name: 'Right', key: 'right'},
    {name: 'Left', key: 'left'},
  ];
  relativeToChoices: IRelativeChoices[] = [];

  constructor(service: NavigationService,
              public fb: FormBuilder,
              toast: ToastService,
              route: ActivatedRoute,
              router: Router) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {entity: INavigation, flatPages: IFlatPage[], relativeChoices: IRelativeChoices[]}) => {
      this.entity = data.entity || null;
      this.children = data.entity?.children || [];

      this.flatPages = data.flatPages;
      this.relativeToChoices = data.relativeChoices;
    });
  }

  setOriginalEntityName(entity?: INavigation) {
    if (!!entity && entity.hasOwnProperty('title')) {
      // tslint:disable:no-string-literal
      this.originalEntityName = entity.title;
    }
  }

  get title(): FormControl { return this.form.get('title') as FormControl; }
  get url(): FormControl { return this.form.get('url') as FormControl; }
  // get displayUrl(): FormControl { return this.form.get('displayUrl') as FormControl; }
  get position(): FormControl { return this.form.get('position') as FormControl; }
  get relativeTo(): FormControl { return this.form.get('relativeTo') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get page(): FormControl { return this.form.get('page') as FormControl; }

  initializeForm(entity?: INavigation) {
    this.form = this.fb.group({
      title: [entity?.title, [Validators.required]],
      href: [entity?.href],
      url: [entity?.url],
      // displayUrl: [entity?.displayUrl],
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
