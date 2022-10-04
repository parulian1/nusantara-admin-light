import {
  Component,
  Input,
  forwardRef,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { marketplace } from '@nusantara/models';
import { MarketplaceShopService } from '@nusantara/services';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ICategoryFormComponentData {
  category: any;
}

export interface IGroupControlComponentData {
  category: ICategoryFormComponentData[];
  childs: IGroupControlComponentData[];
}

@Component({
  selector: 'nus-category-group-control',
  template: `
    <form [formGroup]="form" class="fluid">
      <div>
        <label>
          <span *ngIf="formLabel; else defaultLabel"
                 i18n
            >{{ formLabel }} Subcategory
          </span>
          <ng-template #defaultLabel>
            <span i18n>{{ currentShop }} Category</span>
          </ng-template>
          <select formControlName="category" (ngModelChange)="onSelect($event)">
            <option *ngFor="let c of categories" [ngValue]="c">
              {{ c.name }}
            </option>
          </select>
        </label>
        <ng-container formArrayName="childs">
          <nus-category-group-control
            [categories]="childCategories | async"
            *ngFor="let s of childsFormArray?.controls; index as i"
            (remove)="deleteGroupFromArray(i)"
            [formControlName]="i"
            [formLabel]="selectedCategory?.name"
          >
          </nus-category-group-control>
        </ng-container>
      </div>
    </form>
  `,
  styles: [
    'label { margin-bottom: 12px; min-height: 0; }',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryGroupControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CategoryGroupControlComponent),
      multi: true,
    },
  ],
})
export class CategoryGroupControlComponent
  implements OnDestroy, OnInit, ControlValueAccessor, Validator {
  @Input() categories: marketplace.IProductCategory[] = [];
  @Input() formLabel: string;
  @Input() currentShop: string;

  shopSlug: string;
  form: FormGroup;
  selectedCategory: marketplace.IProductCategory;
  childCategories: Observable<marketplace.IProductCategory[]> = null;

  private onChange: (
    value: IGroupControlComponentData | null | undefined
  ) => void;
  private destroy$: Subject<void> = new Subject<void>();
  private onTouched: () => void = () => {};

  constructor(
    private service: MarketplaceShopService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    this.createFormGroup();
    this.setupObservables();
  }

  ngOnDestroy() {
    if (this.destroy$ && !this.destroy$.closed) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  writeValue(value: IGroupControlComponentData | null | undefined): void {
    if (!value) {
      return;
    }

    this.form.patchValue(value);
  }

  registerOnChange(
    fn: (value: IGroupControlComponentData | null | undefined) => void
  ): void {
    this.onChange = fn;
    this.form.get('category').updateValueAndValidity();
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.form.valid ? null : { category: { valid: false } };
  }

  deleteGroupFromArray(index: number) {
    this.childsFormArray.removeAt(index);
  }

  addGroup() {
    this.childsFormArray.push(
      this.fb.control({
        category: null,
        childs: [],
      })
    );
  }

  get childsFormArray(): FormArray {
    return this.form.get('childs') as FormArray;
  }

  private createFormGroup() {
    this.form = this.fb.group({
      category: ['', Validators.required],
      childs: this.fb.array([]),
    });
  }

  private setupObservables() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  addChild(categoryObj: marketplace.IProductCategory) {
    // delete all child first defore re-adding child
    this.deleteGroupFromArray(0);
    this.selectedCategory = categoryObj;
    this.childCategories = this.getchildCategories();
    this.addGroup();
    this.changeDetectorRef.detectChanges();
  }

  getchildCategories(): Observable<marketplace.IProductCategory[]> {
    if (this.selectedCategory.categoryCode) {
      return this.service.fetchCategory(
        this.shopSlug, null, this.selectedCategory.categoryCode
      );
    }
    return this.service.fetchCategory(
      this.shopSlug,
      this.selectedCategory.categoryId
    );
  }

  onSelect(category: marketplace.IProductCategory) {
    if (category.hasChildren) {
      this.addChild(category);
    } else {
      this.deleteGroupFromArray(0);
    }
  }
}
