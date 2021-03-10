import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ISelectedCategory, IShopAttribute } from '@nusantara/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  MarketplaceShopService,
  MarketplaceCatalogService,
} from '@nusantara/services';
import { ToastLevelEnum, ToastService } from '@nusantara/core/toast';

@Component({
  selector: 'nus-product-class-mapping-form',
  template: `
    <h1 class="title-1">Category & Attribute Mapping</h1>

    <form [formGroup]="form">
      <nus-category-selection-form
        [currentShop]="currentShop"
        [hidden]="!showCategoryForm"
        [state]="state$ | async"
        (cancel)="onBack()"
        (next)="
          showAttributeForm = true;
          showCategoryForm = false;
          showMatchForm = false
        "
        (selectedCategory)="onSelectedCategory($event)"
        formControlName="categorySelection">
      </nus-category-selection-form>

      <nus-attribute-selection-form
        [currentShop]="currentShop"
        [hidden]="!showAttributeForm"
        [state]="state$ | async"
        [category]="selectedCategory$ | async"
        (previous)="showCategoryForm = true; showAttributeForm = false"
        (next)="
          showAttributeForm = false;
          showCategoryForm = false;
          showMatchForm = true
        "
        (saveNoAttr)="onSubmit($event)"
        (selectedAttribute)="onAttributesSubmit($event)"
        formControlName="attributeSelection">
      </nus-attribute-selection-form>

      <nus-attribute-matching-form
        [currentShop]="currentShop"
        [hidden]="!showMatchForm"
        [state]="state$ | async"
        [category]="selectedCategory$ | async"
        [attribute]="selectedAttribute$ | async"
        (previous)="showAttributeForm = true; showMatchForm = false"
        (save)="onSubmit($event)"
        (patchAttr)="onPatchNewAttr($event)"
        formControlName="attributeMatching">
      </nus-attribute-matching-form>
    </form>  `,
  styles: [
    'button:not(:first-child) { margin-left: 5px; }',
    '.sub_title{color: #365DC3;}',
    'h1{font-weight: bold}',
    '.shopee-form-title{font-weight: 700; color: #5A5A5A;}',
    'input[type=text], select{width: 267px}',
  ],
})
export class ProductClassMappingFormComponent implements OnInit {
  form: FormGroup;
  showCategoryForm = true;
  showAttributeForm: boolean;
  showMatchForm: boolean;
  selectedCategory$ = new BehaviorSubject<ISelectedCategory>(null);
  selectedAttribute$ = new BehaviorSubject<IShopAttribute[]>(null);
  productClassSlug: string;
  shopSlug: string;
  state$: Observable<object>;
  currentShop: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private service: MarketplaceShopService,
    private catalogService: MarketplaceCatalogService,
    private toastService: ToastService
  ) {
    this.initializeForm();
  }


  titleCaseWord(word: string) {
    if (!word) { return word; }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  ngOnInit() {
    this.productClassSlug = this.route.snapshot.paramMap.get('product-class-slug');
    this.shopSlug = this.route.snapshot.paramMap.get('shop-slug');
    this.currentShop = this.titleCaseWord(this.shopSlug.split('-')[0]);
    this.state$ = this.route.paramMap.pipe(map(() => window.history.state));

    this.state$.subscribe((state: any) => {
      if (!state.productClass) {
        this.onBack();
      }
    });
  }

  private initializeForm() {
    this.form = this.fb.group({
      categorySelection: this.fb.control(''),
      attributeSelection: this.fb.control(''),
      attributeMatching: this.fb.control(''),
    });
  }

  onSelectedCategory(selectedCat: ISelectedCategory) {
    this.selectedCategory$.next(selectedCat);
  }

  onAttributesSubmit(selectedAttr: IShopAttribute[]) {
    this.selectedAttribute$.next(selectedAttr);
  }

  onBack() {
    this.location.back();
  }

  onSubmit(formValue: any) {
    this.service
      .mapAttribute(formValue, this.shopSlug, this.productClassSlug)
      .subscribe(
        (resp) => {
          this.successMap(resp);
        },
        (err) => {
          this.showErrorToast(err.error.details[0]);
        }
      );
  }

  successMap(resp) {
    if (resp) {
      this.toastService?.addMessage(
        resp.message,
        'Success',
        ToastLevelEnum.info
      );
      this.onBack();
    }
  }

  showErrorToast(err: any) {
    this.toastService?.addMessage(
      err.message,
      'Attributes',
      ToastLevelEnum.error
    );
  }

  onPatchNewAttr(newAttrForm: any) {
    this.catalogService
      .patchNewAttribute(newAttrForm, this.productClassSlug)
      .subscribe(
        (resp) => {
          console.log(resp);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
