import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormArray, Validators, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ICategory, INamedHrefEntity} from '@nusantara/models';
import {CategoryService} from '@nusantara/services';
import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {CategorySelectionModalComponent} from '@nusantara/shared/modals/category-selection-modal.component';
import {getSlugFromHref} from '@nusantara/shared/helpers';
import {ConfirmModalComponent} from '@nusantara/shared/confirm-modal.component';

@Component({
  selector: 'nus-category',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Category">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>
      <div class="wrapper-border">
        <h1 class="heading-1" i18n>General Information</h1>
        <!--      <input type="hidden" [formControl]="href" name="href"> &lt;!&ndash; required for non-JSON form posting &ndash;&gt;-->

        <label>
          <span i18n>Name</span>
          <span>
<!--            <span class="material-icons input-icon-error" *ngIf="name?.errors">warning</span>-->
            <input type="text" [formControl]="name" name="name" class="has-input-icon"
                   placeholder="Input category name"
                   i18n-placeholder>
          </span>
          <nus-field-errors [control]="name"></nus-field-errors>
        </label>

        <label>
          <span i18n>Parent</span>
          <input type="hidden" [formControl]="parent" data-qa="parent">
          <div>
            <input type="text" (click)="selectCategory()" [disabled]="!!entity?.href" readonly
                   [value]="selectedCategory?.name" data-qa="parent-pop">
            <!--        <select [formControl]="parent" name="parent">-->
            <!--          <option *ngFor="let parent of parentOptions"-->
            <!--                  [value]="parent.href">-->
            <!--            {{ parent.pathName }}-->
            <!--          </option>-->
            <!--        </select>-->
            <button type="button" (click)="clearCategory()" [disabled]="!!entity?.href" i18n data-qa="parent-clear-btn">
              Clear Selection
            </button>
          </div>
        </label>

        <label class="toggle">
          <input id="s2" type="checkbox"
                 class="toggle"
                 [formControl]="isActive"
                 name="is-active"
                 data-qa="is-active"/>
          <span i18n>Is Active</span>
          <nus-field-errors [control]="isActive"></nus-field-errors>
        </label>

        <label class="checkbox" style="min-height: 1rem;">
          <input type="checkbox" [formControl]="isInterestedCategory" name="isInterestedCategory" i18n> Show In
          Homepage?
          <nus-field-errors [control]="isInterestedCategory"></nus-field-errors>
        </label>

        <label>
          <span i18n>Icon Image</span>
          <small i18n>Recommended: 65x65</small>
          <img [src]="imagePreviewUrl" alt="Category Icon" class="preview">
          <input type="file"
                 [formControl]="image"
                 (change)="setIconImagePreview($event)"
                 name="image"
                 accept="image/jpeg, image/png">
        </label>

        <!--      <h2 i18n>Source Mappings (optional)</h2>-->
        <!--      <p i18n>-->
        <!--        Maps a category in your source data (such as an ERP system) to-->
        <!--        to this category.  These mappings are only applied once, when-->
        <!--        importing new data.-->
        <!--      </p>-->
        <!--      <table>-->
        <!--        <thead>-->
        <!--        <tr>-->
        <!--          <th i18n>Mapping</th>-->
        <!--          <th></th>-->
        <!--        </tr>-->
        <!--        </thead>-->
        <!--        <tbody>-->
        <!--        <tr *ngFor="let control of sourceMappings.controls; let i=index">-->
        <!--          <td class="immediate-error-display">-->
        <!--            <input [formControl]="control" name="sourceMappings">-->
        <!--          </td>-->
        <!--          <td>-->
        <!--            <button (click)="removeMapping(i)" type="button" class="remove-button">-->
        <!--              <i class="material-icons">remove_circle_outline</i>-->
        <!--            </button>-->
        <!--          </td>-->
        <!--        </tr>-->
        <!--        <tr>-->
        <!--          <td colspan="2">-->
        <!--            <button type="button" (click)="addMapping()" class="add-button" i18n>-->
        <!--              Add Mapping-->
        <!--            </button>-->
        <!--          </td>-->
        <!--        </tr>-->
        <!--        </tbody>-->
        <!--      </table>-->

      </div>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
    <nus-category-selection-modal #categoryModal></nus-category-selection-modal>
    <nus-confirm-modal
      [title]="confirmCategoryTitle + name?.value + '?'"
      [content]="confirmCategoryContent">
    </nus-confirm-modal>
  `,
  styles: [
    'img { height: 65px; width: 65px; }',
    'input[type=file] { display: none; }',
  ]
})
export class CategoryComponent extends AbstractDetailComponent<ICategory> implements OnInit, AfterViewInit {
  confirmCategoryTitle = 'Delete this category ';
  confirmCategoryContent = 'Are you sure you want to delete this category';

  parentOptions: ICategory[] = [];
  imagePreviewUrl: string;
  entity?: ICategory;

  selectedCategory: INamedHrefEntity = null;

  @ViewChild('categoryModal') categorySelectionModal: CategorySelectionModalComponent;
  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;

  constructor(service: CategoryService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: { parentOptions: ICategory[] }) => {
      this.parentOptions = data.parentOptions;
    });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.categorySelectionModal.onClose.subscribe(() => this.onCategorySelectionModalClosed());
    this.confirmModal.onClose.subscribe(() => this.onConfirmModalClosed());

  }

  private onCategorySelectionModalClosed(): void {
    if (this.categorySelectionModal.result === DialogResult.OK) {
      this.selectedCategory = this.categorySelectionModal.category.value as ICategory;
      this.parent.setValue(this.selectedCategory.href);
    }
  }

  selectCategory(): void {
    this.categorySelectionModal.open();
  }

  initializeForm(entity?: ICategory) {
    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(50)]],
      isActive: [!!entity?.href ? entity?.isActive : true, []],
      isInterestedCategory: [entity?.isInterestedCategory ?? false, []],
      href: [entity?.href, []],
      image: ['', []],
      parent: [{value: entity?.parent ?? null, disabled: !!entity?.href}, []],
      sourceMappings: this.fb.array([])
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();
    this.form.controls.isInterestedCategory.markAsTouched();

    this.setIconImagePreview(entity?.image);
    this.selectedCategory = null;
    if (!!entity?.parent) {
      this.service.fetch(getSlugFromHref(entity?.parent)).subscribe(res => {
        this.selectedCategory = res;
      }, err => {

      });
    }
    entity?.sourceMappings.forEach(
      (value) => {
        this.addMapping(value);
      }
    );
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get isActive(): FormControl {
    return this.form.get('isActive') as FormControl;
  }

  get isInterestedCategory(): FormControl {
    return this.form.get('isInterestedCategory') as FormControl;
  }

  get image(): FormControl {
    return this.form.get('image') as FormControl;
  }

  get parent(): FormControl {
    return this.form.get('parent') as FormControl;
  }

  get sourceMappings(): FormArray {
    return this.form.get('sourceMappings') as FormArray;
  }

  setIconImagePreview(data?: Event | string) {
    super.setImagePreview(data, (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
  }

  addMapping(value?: string) {
    this.sourceMappings.push(
      this.fb.control(value ?? '', [Validators.required, Validators.maxLength(255)])
    );
  }

  removeMapping(index: number) {
    this.sourceMappings.removeAt(index);
  }

  save() {
    if (!!this.entity?.href && !!this.entity?.image && !this.image?.value) {
      this.form.removeControl('image');
    }
    if (!!this.image && this.imagePreviewUrl.match(/^(?:[data]{4}:(image)\/[a-z]*)/)) {
      this.form.value.image = this.imagePreviewUrl;
    }
    super.save();
  }

  clearCategory(): void {
    this.parent.setValue(null);
    this.selectedCategory = null;
  }

  private onConfirmModalClosed() {
    if (this.confirmModal.result === DialogResult.OK) {
      this.service.delete(this.form.value).subscribe(
        resp => {
          if (resp.success) {
            this.onDeleteSuccess();
          } else {
            this.onDeleteError(resp);
          }
        },
        (err) => this.onDeleteError(err)
      );
      this.form.disable();
    }
  }


  delete() {
    this.confirmModal.open();
  }
}
