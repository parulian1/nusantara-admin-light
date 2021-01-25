import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {SlideInOutAnimation} from '@nusantara/shared';
import { ToastService, AbstractDetailComponent, PagedResponse, getSlugFromHref, NusantaraValidators, ErrorResult } from '@nusantara/core';
import {
  ICategory,
  IVendor,
  drf,
  products,
  IMarketplaceItemAttributeInformation,
  IShopAttributeMapping, IMarketplaceItemLogisticInformation, IMarketplaceItemInformation, IClient
} from '@nusantara/models';
import { IError } from '@nusantara/models/base/error';
import {MarketplaceClientService, ProductService} from '@nusantara/services';
import { PriceListHostComponent } from './price';
import { ProductMediaHostComponent } from './media';
import { ProductAttributeHostComponent } from './attribute';
import { ProductSubscriptonHostComponent } from './subscription';
import {MarketplaceInfoDetailProductPageComponent} from "../../../shared/marketplace-info-detail-product-page.component";
import {MarketplaceInfoShippingModalComponent} from "../../../shared/marketplace-info-shipping-modal.component";
import {ProductSelectionModalComponent} from "../../../shared";
import {MarketplaceClientEnum} from "../../config/marketplace-integration/setup/markeplace-client-enum";
import {MarketplaceItemService} from "../../../services/marketplace-item.service";

/**
 * Allows the user to edit/create a single product.
 */
@Component({
  selector: 'nus-product',
  animations: [SlideInOutAnimation],
  templateUrl:'./product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends AbstractDetailComponent<products.IProduct> implements OnInit, AfterViewInit {

  productClasses: Array<products.IProductClass>;
  productClassSlug: string;
  categories: Array<ICategory>;
  vendors: Array<IVendor>;
  attribute: Array<products.IProductAttribute>;
  mediaTypes: Array<drf.IChoice>;
  parentProduct: products.IProduct;
  variants: Array<products.IVariantSummary> = [];
  originalAttributeValues: {[key: string]: string|number|boolean};
  entity: products.IProduct;
  currentActive = 'general-info';
  warehouseValue: number=0;
  storeValue:number=0;
  marketplaceValue:number=0;
  productSlug: string;
  shippingDetail: any;
  warehouseInfoDetail: any;
  marketplaceStoreAttributes: any;
  visible: boolean;
  animationState = 'out';
  Editor = ClassicEditor;
  clientList: IClient[];
  marketplaceClient = MarketplaceClientEnum;
  productClassEntity: IShopAttributeMapping;
  productClassName: string;
  showNoSlider: boolean;
  showDivIndex: number;
  isBusy: boolean;
  isComboBox: boolean;
  isDropDown: boolean;
  detailAttributes: string[];
  isInput: boolean;
  currentMarketpalce: string;
  showAttribute: number;

  @ViewChild(ProductMediaHostComponent) mediaHost!: ProductMediaHostComponent;
  @ViewChild(PriceListHostComponent) priceListHost!: PriceListHostComponent;
  @ViewChild(ProductAttributeHostComponent) attributeHost!: ProductAttributeHostComponent;
  @ViewChild(ProductSubscriptonHostComponent) subscriptionHost!: ProductSubscriptonHostComponent;
  @ViewChild(MarketplaceInfoShippingModalComponent) shippingModalComponent: MarketplaceInfoShippingModalComponent;
  @ViewChild(MarketplaceInfoDetailProductPageComponent) marketplaceInfo: MarketplaceInfoDetailProductPageComponent;
  hideOnChangeProductClass: boolean;

  constructor(service: ProductService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public toast: ToastService,
              public router: Router,
              public clientService: MarketplaceClientService,
              public itemService: MarketplaceItemService,
              public modal: NgxSmartModalService) {
    super(route, router, toast, service);
  }
  @ViewChild(ProductSelectionModalComponent) productSelectionModal: ProductSelectionModalComponent;



  get name(): FormControl { return this.form.get('name') as FormControl; }
  get isActive(): FormControl { return this.form.get('isActive') as FormControl; }
  get upc(): FormControl { return this.form.get('upc') as FormControl; }
  get productClass(): FormControl { return this.form.get('productClass').get('href') as FormControl; }
  get category(): FormControl { return this.form.get('category').get('href') as FormControl; }
  get vendor(): FormControl { return this.form.get('vendor').get('href') as FormControl; }
  get description(): FormControl { return this.form.get('description') as FormControl; }
  get media(): FormArray { return this.form.get('media') as FormArray; }
  get priceLists(): FormArray { return this.form.get('priceLists') as FormArray; }
  get attributes(): FormGroup { return this.form.get('attributes') as FormGroup; }
  get related(): FormArray { return this.form.get('related') as FormArray; }
  get weight(): FormControl { return this.form.get('weight') as FormControl; }
  get length(): FormControl { return this.form.get('length') as FormControl; }
  get width(): FormControl { return this.form.get('width') as FormControl; }
  get height(): FormControl { return this.form.get('height') as FormControl; }
  get parent(): FormControl { return this.form.get('parent') as FormControl; }
  get structure(): FormControl { return this.form.get('structure') as FormControl; }
  get tags(): FormArray { return this.form.get('tags') as FormArray; }
  get seoMeta(): FormControl { return this.form.get('seoMeta') as FormControl; }
  get seoDescription(): FormControl { return this.form.get('seoDescription') as FormControl; }
  get subscription(): FormControl { return this.form.get('subscription') as FormControl; }
  get marketplaceAttributes() {return this.form.get('marketplaceAttributes') as FormArray;}
  get dimensions() {return this.form.get('dimension') as FormArray;}

  get isProductOptionDomain(): boolean {
    const pc = this.productClasses.filter(e => e.href === (this.form.get('productClass').get('href') as FormControl)?.value)[0];
    if (pc && (pc.type === 'subscription' && pc.option)) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.hideOnChangeProductClass = false;
    this.showNoSlider = false;
    this.route.data.subscribe((
      data: { entity: products.IProduct, categories: ICategory[], parent: products.IProduct, vendors: PagedResponse<IVendor>,
        productClasses: products.IProductClass[], mediaTypes: drf.IChoice[]}) => {
      this.parentProduct = data.parent;
      this.vendors = data.vendors.entities;
      this.categories = data.categories;
      this.productClasses = data.productClasses;
      this.mediaTypes = data.mediaTypes;
      this.entity = data.entity;
    });
    this.visible = false;

    if (this.isNew){
      this.productSlug = this.route.snapshot.paramMap.get('slug')
      this.itemService
        .getItemMarketplaceInformation(this.productSlug)
        .subscribe((data: IMarketplaceItemInformation) => {
          this.warehouseValue = data.totalWarehouse;
          this.marketplaceValue = data.totalMarketplace;
          this.storeValue = data.totalStore;
          this.warehouseInfoDetail = data.details;
        });


      this.itemService
        .getItemMarketplaceLogisticInformation(this.productSlug)
        .subscribe((data: IMarketplaceItemLogisticInformation) => {
          this.shippingDetail = data;
        });

      this.clientService
        .client.subscribe((data: IClient[]) => {
          this.clientList = data;
        });
    }

    this.route.data.subscribe((data: { entity: products.IProduct }) => {
      this.initializeForm(data.entity);
      this.setOriginalEntityName(data.entity);
    });
  }

  /**
   * Configures the form that is edited in this component.
   *
   * Special notes related to the ProductComponent:
   * 1. There is differing logic depending on whether we're initializing a parent or a child (variant)
   * 2. From a parent, the variants array is READ-ONLY at the API, so we DO NOT set it on this form.
   */
  initializeForm(entity?: products.IProduct) {

    this.form = this.fb.group({
      name: [entity?.name, [Validators.required, Validators.maxLength(120), ]],
      isActive: [entity?.isActive, []],
      parent: [entity?.parent ],
      href: [entity?.href],
      upc: [entity?.upc, [Validators.required, ]],
      structure: [entity?.structure ?? 'parent', [Validators.required, ]],
      description: [entity?.description, [Validators.required, ]],
      weight: [entity?.weight, [Validators.required, ]],
      dimensions: this.fb.group({
        current_length:[entity?.dimensions.currentLength,],
        current_width:[entity?.dimensions.currentWidth,],
        current_height:[entity?.dimensions.currentHeight,]
      }),
      productClass: this.fb.group({href: [entity?.productClass.href, [Validators.required]]}),
      category: this.fb.group({href: [entity?.category.href, [Validators.required]]}),
      vendor: this.fb.group({href: [entity?.vendor?.href, [Validators.required]]}),
      media: this.fb.array([]),
      attributes: this.fb.group({}, []),
      marketplaceAttributes: this.fb.array([]),
      priceLists: this.fb.array([]),
      related: this.fb.array([]),
      seoMeta: [entity?.seoMeta, []],
      seoDescription: [entity?.seoDescription, []],
      tags: this.fb.array([], [NusantaraValidators.preventArrayDuplicates(), ]),
      subscription: this.fb.group({}, []),
    });

    // new product variant
    if (!entity && !!this.parentProduct) {
      this.parent.setValue(this.parentProduct.href);
      this.structure.setValue('child');

      // mandatory inheritance from parent
      this.productClass.setValue(this.parentProduct.productClass.href);
      this.category.setValue(this.parentProduct.category.href);
      this.vendor.setValue(this.parentProduct.vendor.href);

      // optional inheritance from parent
      this.description.setValue(this.parentProduct.description);
    }

    this.variants = entity?.variants ?? [];
    this.originalAttributeValues = entity?.attributes ?? {};

    for (const relatedProduct of entity?.related ?? []) {
      this.related.push(
        this.fb.control({
          name: [relatedProduct.name],
          href: [relatedProduct.href],
          image: [relatedProduct.image],
          vendor: [relatedProduct.vendor],
        })
      );
    }

    for (const t of entity?.tags ?? []) {
      this.addTag(t);
    }

    // listen for any changes to this so we can disable weight when appropriate
    this.productClass.valueChanges.subscribe(val => this.onProductClassChanged(val));
    this.onProductClassChanged(this.productClass.value?.href ?? this.productClass.value );
  }

  initializeSubViewForms(entity?: products.IProduct) {
    for (const priceList of entity?.priceLists ?? []) {
      this.priceListHost.addPriceList(priceList);
    }
    // if the product doesn't have a pricelist, we automatically add one.
    if (!entity?.priceLists.length) {
      this.priceListHost.addPriceList({
        href: null,
        product: this.href.value,
        type: 'default',
        platforms: [],
        locations: [],
        isProgressive: false,
        ranges: [
          { href: null, priceList: null, price: null, minQuantity: 1, maxQuantity: null },
        ]
      });
    }

    for (const media of entity?.media ?? []) {
      this.mediaHost.add(media);
    }

    if (entity?.subscription) {
      this.subscriptionHost.add(entity?.subscription);
    }
  }

  /**
   * Overridden implementation: This form hosts several sub-views, which must
   * be saved separate of the main product:  Because of that, the data
   * must be deleted from the data we pass to the product service.
   */
  getFormValue(): any {
    const formValue = {};
    delete (this.form.value.marketplaceAttributes);
    Object.assign(formValue, this.form.value);

    // delete sub entities that shouldn't be saved on the primary object
    // like price-lists, media, dll.
    delete (formValue as products.IProduct).media;
    delete (formValue as products.IProduct).priceLists;
    return formValue;
  }

  save() {

    const formPatch = {
      attributes: this.formValueMapping,
    };
    // we should patch here after know that the marketplace is different, otherwise the data will be gone
    this.patchAttribute(formPatch)

    this.service.save(this.getFormValue()).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        return of(new ErrorResult<IError>(err.error, err.status));
      } else {
        return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, err.status));
      }
    })).subscribe(resp => {
        if (resp instanceof ErrorResult) {
          this.onSaveError(resp);
        } else {
          if (this.isProductOptionDomain) this.subscriptionHost.save(resp.entity).subscribe(() => { });

          this.mediaHost.saveAll(resp.entity).subscribe(() => { });
          this.priceListHost.saveAll(resp.entity).pipe(catchError(child_err => {
            if (child_err instanceof HttpErrorResponse) {
              return of(new ErrorResult<IError>(child_err.error, child_err.status));
            } else {
              return of(new ErrorResult<IError>({message: 'Network error.. probably?'}, child_err.status));
            }
          })).subscribe( (child_resp) => {
              if (child_resp instanceof ErrorResult) {
                this.onSaveError(child_resp);
              } else {
                this.onSaveSuccess(resp);
              }
            }
          );
        }
      }
    );
    this.form.disable();
  }

  addVariant() {
    this.router.navigate(['./variants/new'], {relativeTo: this.route});
  }


  addTag(value?: string) {
    this.tags.push(
      this.fb.control(value, [Validators.required, ])
    );
  }

  addRelatedProduct() {
    throw Error('Not Implemented');
  }

  navigateToParent(warnOnDirty: boolean = false) {
    if (this.structure.value === 'parent') {
      super.navigateToParent(warnOnDirty);
    } else {
      this.router.navigate([`/catalog/products/${getSlugFromHref(this.parentProduct.href)}`]);
    }
  }

  /**
   * Disables irrelevant/invalid product values for certain classes of product.
   */
  onProductClassChanged(newValue: any) {
    // protect against triggering during initialization
    if (!newValue || !this.productClasses) { return; }
    const pc = this.productClasses.filter(e => e.href === newValue)[0];
    const slugs = pc.href.split('/').reverse();
    this.productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.hideOnChangeProductClass = true;

    this.productClassName = pc.name;

    if (pc.type === 'physical') {
      this.weight.enable();
    } else {
      this.weight.disable();
    }
  }

  scrollTo(id: string) {
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    this.currentActive = id;
  }

  goToAttribute(): void {
    this.router.navigate(['/catalog/product-classes', this.productClassSlug]);
  }

  showMarketplaceDetail() {
    this.marketplaceInfo.open()
  }

  showShippingDetail() {
    this.shippingModalComponent.open();
  }

  show(){
    this.visible=true;
  }

  toggleShowDiv(index: number) {
      this.showDivIndex = index;
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  getAttributeOfMarketplace(marketplace: any) {
    this.showNoSlider = false;
    this.hideOnChangeProductClass = false;
    if(this.currentMarketpalce){
      if(this.currentMarketpalce !== marketplace.toLowerCase()){
        const formPatch = {
          attributes: this.formValueMapping,
        };
          //we should patch here after know that the marketplace is different, otherwise the data will be gone
        this.patchAttribute(formPatch)
      }
    }

    this.currentMarketpalce = marketplace.toLowerCase();
    this.clearFormArray(this.marketplaceAttributes);

    this.itemService
      .getItemMarketplaceAttribute(this.currentMarketpalce,this.productClassSlug.toLowerCase(), this.productSlug)
      .subscribe((data: IMarketplaceItemAttributeInformation[]) => {
        this.isBusy = true;
        this.marketplaceStoreAttributes = data;
        this.isDropDown = false;
        this.isInput = false;
        this.isComboBox = false;

        if(data === null){
          this.showNoSlider = true;
        }

        //loop add form for edit attribute
        data?.forEach((objStore:IMarketplaceItemAttributeInformation,index) => {
          objStore.attributes.forEach((objAttr) => {
            this.marketplaceAttributes.push(
              this.fb.group({
                name: [objAttr.name],
                type: [objAttr.type],
                identifier: [objAttr.identifier],
                value: [objAttr.value],
                option: [objAttr.option],
                newvalue: null,
                indexShop: index,
              })
            );
          });
        })
    });
  }

  get formValueMapping() {
    //this part is to validate new value at combo box
    return this.marketplaceAttributes.value.map((attr: any) => {
      let currVal = attr.value;
      if(attr.newvalue!==null){
        currVal = attr.newvalue;
      }
      return {
        identifier: attr.identifier,
        value: currVal,
        product: this.productSlug,
      };
    });
  }

  attrChange(value: string, index: number) {
    const attr = this.marketplaceAttributes.at(index).get('newvalue');
    if (value === 'addNewAttr') {
      attr.setValidators(Validators.required);

      //should set string otherwise it will give value addNewAttr
      attr.setValue("")
    } else {
      attr.clearValidators();
      attr.reset();
    }
    attr.updateValueAndValidity();
  }

  patchAttribute(formPatch: any){
    this.itemService
      .patchItemAttribute(formPatch, this.productClassSlug.toLowerCase())
      .subscribe(
        (resp) => {
          console.log(resp);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onChangeProductClass(event: any) {
    const slugs = event.target.value.split('/').reverse();

    // get last slug
    this.productClassSlug = slugs[0] ? slugs[0] : slugs[1];
    this.hideOnChangeProductClass = true;
    this.clearFormArray(this.marketplaceAttributes);
  }

  updateValidator(newForm: any) {
    if(!newForm){
        this.form.controls['marketplaceAttributes'].setValidators([Validators.required,]);
        this.form.controls['marketplaceAttributes'].updateValueAndValidity();
    }
  }
}
