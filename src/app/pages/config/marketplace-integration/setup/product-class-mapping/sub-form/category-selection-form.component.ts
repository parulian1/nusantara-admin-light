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
import { marketplace } from '@nusantara/models';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SubFormComponent } from './sub-form.component';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'nus-category-selection-form',
  template: `
    <form [formGroup]="form" class="fluid">
      <div class="wrapper">
        <h1 class="heading-1">Choose Category (1/3)</h1>
        <p>Choose a category that matches your Product Class</p>

        <div class="form">
          <label>
            <span>Product Class Name</span>
            <span>{{ productClassName }}</span>
          </label>

          <ng-container formArrayName="categories">
            <nus-category-group-control
              [categories]="categories"
              [currentShop]="currentShop"
              *ngFor="let s of categoriesFormArray?.controls; index as i"
              [formControlName]="i">
            </nus-category-group-control>
          </ng-container>
        </div>
      </div>

      <button type="button" [disabled]="form.invalid" class="control" (click)="onNext()">
        Next
      </button>
      <button type="button" class="control secondary ghost" (click)="onCancel()">
        Cancel
      </button>

    </form>
  `,
  styles: [
    `.wrapper { padding: 16px 24px; border: solid 1px var(--grey); border-radius: 4px; width: 60vw; margin-bottom: 20px; }`,
    'p {color: var(--darken-grey); }',
    '.form { margin-top: 20px; }',
    'label { margin-bottom: 12px; min-height: 0; }',
    'button:not(:first-of-type) { margin-left: 5px; }',
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
  @Output() selectedCategory = new EventEmitter<marketplace.ISelectedCategory>();
  @Input() currentShop: string;

  categories: marketplace.IProductCategory[] = [];
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
      .subscribe((data: marketplace.IProductCategory[]) => {
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
    const selectedCat: marketplace.ISelectedCategory = {
      categoryNames: this.getSelectedCategoryNames(this.form.value.categories),
      deepestChildId: this.getChildCatgoryId(this.form.value.categories),
    };
    this.selectedCategory.next(selectedCat);
  }

  onCancel() {
    this.cancel.next(true);
  }
}
