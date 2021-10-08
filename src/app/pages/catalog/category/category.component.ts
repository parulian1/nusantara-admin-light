import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {ICategory, INamedHrefEntity} from '@nusantara/models';
import { CategoryService } from '@nusantara/services';
import {AbstractDetailComponent, DialogResult, ToastService} from '@nusantara/core';
import {CategorySelectionModalComponent} from '@nusantara/shared/modals/category-selection-modal.component';
import {getSlugFromHref} from '@nusantara/shared/helpers';

@Component({
  selector: 'nus-category',
  template: `
    <nus-detail-title
      [originalName]="originalEntityName"
      typeName="Category">
    </nus-detail-title>

    <nus-non-field-errors [nonFieldErrors]="nonFieldErrors"></nus-non-field-errors>

    <form [formGroup]="form" (ngSubmit)="save()" #f>

<!--      <input type="hidden" [formControl]="href" name="href"> &lt;!&ndash; required for non-JSON form posting &ndash;&gt;-->

      <label>
        <span i18n>Name</span>
        <input type="text" [formControl]="name" name="name">
        <nus-field-errors [control]="name"></nus-field-errors>
      </label>

      <label>
        <span i18n>Parent</span>
        <input type="hidden" [formControl]="parent" data-qa="parent">
        <div>
        <input type="text" (click)="selectCategory()" [disabled]="!!entity?.href" readonly [value]="selectedCategory?.name" data-qa="parent-pop">
<!--        <select [formControl]="parent" name="parent">-->
<!--          <option *ngFor="let parent of parentOptions"-->
<!--                  [value]="parent.href">-->
<!--            {{ parent.pathName }}-->
<!--          </option>-->
<!--        </select>-->
          <button type="button" (click)="clearCategory()" [disabled]="!!entity?.href" i18n>Clear Selection</button>
        </div>
      </label>

      <label class="checkbox" style="min-height: 1rem;">
        <input type="checkbox" [formControl]="isActive" name="isActive" i18n> Is Active
        <nus-field-errors [control]="isActive"></nus-field-errors>
      </label>

      <label class="checkbox" style="min-height: 1rem;">
        <input type="checkbox" [formControl]="isInterestedCategory" name="isInterestedCategory" i18n> Interest Categories ?
        <nus-field-errors [control]="isInterestedCategory"></nus-field-errors>
      </label>

      <label>
        <span i18n>Icon</span>
        <img [src]="imagePreviewUrl" alt="Category Icon" class="preview">
        <small i18n>Recommended: 65x65</small>
        <input type="file"
               [formControl]="image"
               (change)="setIconImagePreview($event)"
               name="image"
               accept="image/*">
      </label>

      <h2 i18n>Source Mappings (optional)</h2>
      <p i18n>
        Maps a category in your source data (such as an ERP system) to
        to this category.  These mappings are only applied once, when
        importing new data.
      </p>
      <table>
        <thead>
        <tr>
          <th i18n>Mapping</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let control of sourceMappings.controls; let i=index">
          <td class="immediate-error-display">
            <input [formControl]="control" name="sourceMappings">
          </td>
          <td>
            <button (click)="removeMapping(i)" type="button" class="remove-button">
              <i class="material-icons">remove_circle_outline</i>
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <button type="button" (click)="addMapping()" class="add-button" i18n>
              Add Mapping
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <nus-detail-actions
        [component]="this"
        (cancel)="navigateToParent(true)"
        (delete)="delete()">
      </nus-detail-actions>

    </form>
    <nus-category-selection-modal #categoryModal></nus-category-selection-modal>
  `,
  styles: [
    'img { height: 65px; width: 65px; }',
    'input[type=file] { display: none; }',
  ]
})
export class CategoryComponent extends AbstractDetailComponent<ICategory> implements OnInit, AfterViewInit {

  parentOptions: ICategory[] = [];
  imagePreviewUrl: string;
  entity?: ICategory;

  selectedCategory: INamedHrefEntity = null;

  @ViewChild('categoryModal') categorySelectionModal: CategorySelectionModalComponent;

  constructor(service: CategoryService,
              route: ActivatedRoute,
              router: Router,
              toast: ToastService,
              private fb: FormBuilder) {
    super(route, router, toast, service);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.subscribe((data: {parentOptions: ICategory[]}) => {
      this.parentOptions = data.parentOptions;
    });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.categorySelectionModal.onClose.subscribe(() => this.onCategorySelectionModalClosed());

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
      isActive: [entity?.isActive ?? true, []],
      isInterestedCategory: [entity?.isInterestedCategory ?? false, []],
      href: [entity?.href, []],
      image: ['', []],
      parent: [{value: entity?.parent ?? null, disabled: !!entity?.href }, []],
      sourceMappings: this.fb.array([])
    });

    this.entity = entity;

    // need to mark as touched to make custom styling works
    this.form.controls.isActive.markAsTouched();
    this.form.controls.isInterestedCategory.markAsTouched();

    this.setIconImagePreview(entity?.image);

    this.service.fetch(getSlugFromHref(entity?.parent)).subscribe( res => {
      this.selectedCategory = res;
    }, err => {
      this.selectedCategory = null;
    });

    entity?.sourceMappings.forEach(
      (value) => { this.addMapping(value); }
    );
  }

  get name(): FormControl { return this.form.get('name') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get isInterestedCategory(): FormControl { return this.form.get('isInterestedCategory') as FormControl; }
  get image(): FormControl { return this.form.get('image') as FormControl; }
  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get sourceMappings(): FormArray { return this.form.get('sourceMappings') as FormArray; }

  setIconImagePreview(data?: Event|string) {
    super.setImagePreview(data,  (dataAsUrl) => this.imagePreviewUrl = dataAsUrl);
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
}
