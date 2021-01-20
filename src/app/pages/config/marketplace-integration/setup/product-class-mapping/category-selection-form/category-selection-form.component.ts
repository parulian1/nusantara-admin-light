import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceShopService } from '@nusantara/services';
import { IProductCategory, ISelectedCategory } from '@nusantara/models';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SubFormComponent } from '../sub-form.component';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'nus-category-selection-form',
  template: `
    <h2 class="sub-title">Choose Category (1/3)</h2>
    <p>Choose a category that matches your Product Class</p>

    <form [formGroup]="form">
      <label>
        <span>Product Class Name</span>
        <span>{{ productClassName }}</span>
      </label>

      <ng-container formArrayName="categories">
        <nus-category-group-control
          [categories]="categories"
          [currentShop]="currentShop"
          *ngFor="let s of categoriesFormArray?.controls; index as i"
          [formControlName]="i"
        >
        </nus-category-group-control>
      </ng-container>

      <button type="button" class="control secondary" (click)="onCancel()">
        Cancel
      </button>
      <button
        type="button"
        [disabled]="form.invalid"
        class="control"
        (click)="onNext()"
      >
        Next
      </button>
    </form>
  `,
  styles: [
    'button:not(:first-child) { margin-left: 5px; }',
    '.sub-title{color: #365DC3;}',
    'h1{font-weight: bold}',
    'input[type=text], select{width: 267px}',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelectionFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CategorySelectionFormComponent),
      multi: true,
    },
  ],
})
export class CategorySelectionFormComponent
  extends SubFormComponent
  implements OnInit {
  @Input() state: any;
  @Output() cancel = new EventEmitter<boolean>();
  @Output() next = new EventEmitter<boolean>();
  @Output() selectedCategory = new EventEmitter<ISelectedCategory>();
  @Input() currentShop : string;

  categories: IProductCategory[] = [];
  shopSlug: string;
  productClassName: string;
  form: FormGroup;


  constructor(
    private service: MarketplaceShopService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private modal: NgxSmartModalService
  ) {
    super();
    this.initializeForm();
    this.addGroup();
  }

  ngOnInit() {
    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    this.productClassName = this.state.productClass.name;

    this.service
      .fetchCategory(this.shopSlug)
      .subscribe((data: IProductCategory[]) => {
        this.categories = data;
      });

    this.changeDetectorRef.detectChanges();
  }

  private initializeForm() {
    this.form = this.fb.group({
      categories: this.fb.array([]),
    });
  }

  addGroup() {
    this.categoriesFormArray.push(
      this.fb.control({
        category: null,
        childs: [],
      })
    );
  }

  get categoriesFormArray(): FormArray {
    return this.form.get('categories') as FormArray;
  }

  getChildCatgoryId(data): number {
    if (data[0].childs.length > 0) {
      return this.getChildCatgoryId(data[0].childs);
    } else {
      return data[0].category.categoryId;
    }
  }

  getSelectedCategoryNames(data: any, names?: string[]): string[] {
    names = names || [];
    names.push(data[0].category.name);
    if (data[0].childs.length > 0) {
      return this.getSelectedCategoryNames(data[0].childs, names);
    } else {
      return names;
    }
  }

  onNext() {
    this.next.next(true);
    const selectedCat: ISelectedCategory = {
      categoryNames: this.getSelectedCategoryNames(this.form.value.categories),
      deepestChildId: this.getChildCatgoryId(this.form.value.categories),
    };
    this.selectedCategory.next(selectedCat);
  }

  onCancel() {
    this.cancel.next(true);
  }
}
