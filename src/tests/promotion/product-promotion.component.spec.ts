import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@nusantara/shared';
import { ProductPromotionComponent } from '@nusantara/pages/promotion/promotion';
import { ProductPromotionService } from '@nusantara/services';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProductPromotionComponent', () => {
  let component: ProductPromotionComponent;
  let fixture: ComponentFixture<ProductPromotionComponent>;

  let httpTestingController: HttpTestingController;

  let service: ProductPromotionService;

  const productPromoResponse = {
    href: 'https://staging.bhisma.cloud/api/catalog/product-promotion/test-promo-shabrina-2/',
    products: [
      {
        href: 'https://staging.bhisma.cloud/api/catalog/product/am-satin-lipstick-saffron-pink-01/',
        name: 'AM Satin Lipstick Saffron Pink 01'
      },
      {
        href: 'https://staging.bhisma.cloud/api/catalog/product/am-satin-lipstick-saffron-pink-02/',
        name: 'AM Satin Lipstick Saffron Pink 02'
      }
    ],
    banner: null,
    isActive: true,
    name: 'test promo shabrina 2',
    type: 'percentage',
    amount: 20.0,
    minimumOrderAmount: 0.0,
    maxAmount: 1000000.0,
    isExclusive: false,
    validFrom: '2020-08-06T23:50:23.213000+07:00',
    validTo: null
  };

  const productPromoUpdatedResponse = {
    href: 'https://staging.bhisma.cloud/api/catalog/product-promotion/test-promo-shabrina-2/',
    products: [
      {
        href: 'https://staging.bhisma.cloud/api/catalog/product/am-satin-lipstick-saffron-pink-01/',
        name: 'AM Satin Lipstick Saffron Pink 01'
      }
    ],
    banner: null,
    isActive: true,
    name: 'promo edited',
    type: 'amount_off',
    amount: 200000,
    minimumOrderAmount: 0.0,
    maxAmount: 300000,
    isExclusive: true,
    validFrom: '2020-09-07T23:50:23.213000+07:00',
    validTo: '2020-10-28T23:50:23.213000+07:00',
    priority: 1
  };

  beforeEach( async() => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        ProductPromotionComponent,
      ],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductPromotionService);
    fixture = TestBed.createComponent(ProductPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('required field validity', () => {
    const name = component.form.controls.name;
    const type = component.form.controls.type;
    const amount = component.form.controls.amount;
    const minimumOrderAmount = component.form.controls.minimumOrderAmount;
    const maxAmount = component.form.controls.maxAmount;
    const isExclusive = component.form.controls.isExclusive;
    const isActive = component.form.controls.isActive;
    const validFrom = component.form.controls.validFrom;

    name.setValue('');
    type.setValue('');
    amount.setValue('');
    minimumOrderAmount.setValue('');
    maxAmount.setValue('');
    isExclusive.setValue('');
    isActive.setValue('');
    validFrom.setValue('');

    expect(name.hasError('required')).toBeTruthy();
    expect(type.hasError('required')).toBeTruthy();
    expect(amount.hasError('required')).toBeTruthy();
    expect(minimumOrderAmount.hasError('required')).toBeTruthy();
    expect(maxAmount.hasError('required')).toBeTruthy();
    expect(isExclusive.hasError('required')).toBeTruthy();
    expect(isActive.hasError('required')).toBeTruthy();
    expect(validFrom.hasError('required')).toBeTruthy();
  });

  it('field cant be minus validity', () => {
    component.amount.setValue(-1);
    component.minimumOrderAmount.setValue(-2);
    component.maxAmount.setValue(-1);

    expect(component.amount.hasError('min')).toBeTruthy();
    expect(component.minimumOrderAmount.hasError('min')).toBeTruthy();
    expect(component.maxAmount.hasError('min')).toBeTruthy();
  });

  it('can create a new promo', () => {
    component.form.setValue({
      href: '',
      name: productPromoResponse.name,
      type: productPromoResponse.type,
      amount: productPromoResponse.amount,
      minimumOrderAmount: productPromoResponse.minimumOrderAmount,
      maxAmount: productPromoResponse.maxAmount,
      isExclusive: productPromoResponse.isExclusive,
      isActive: productPromoResponse.isActive,
      validFrom: component.convertDateTime(productPromoResponse.validFrom) + component.getTimeZone(),
      validTo: component.convertDateTime(productPromoResponse.validTo) + component.getTimeZone(),
      banner: '',
      products: [],
      priority: 1,
      appliedOnOnline: 1,
      appliedOnOffline: 1,
      productBundlingBenefit: [],
      productBundlingCondition: [],
      multiplyItem: false
    });
    // @ts-ignore
    const p1 = component.fb.group({
      name: [productPromoResponse.products[0].name, []],
      href: [productPromoResponse.products[0].href, []]
    });
    // @ts-ignore
    const p2 = component.fb.group({
      name: [productPromoResponse.products[1].name, []],
      href: [productPromoResponse.products[1].href, []]
    });
    component.products.push(p1);
    component.products.push(p2);
    component.save();

    const mock = httpTestingController.expectOne('/api/catalog/product-promotion/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(productPromoResponse.name);
    expect(mock.request.body.type).toBe(productPromoResponse.type);
    expect(mock.request.body.amount).toBe(productPromoResponse.amount);
    expect(mock.request.body.minimumOrderAmount).toBe(productPromoResponse.minimumOrderAmount);
    expect(mock.request.body.maxAmount).toBe(productPromoResponse.maxAmount);
    expect(mock.request.body.isExclusive).toEqual(productPromoResponse.isExclusive);
    expect(mock.request.body.isActive).toEqual(productPromoResponse.isActive);
    expect(mock.request.body.validFrom).toEqual(component.convertDateTime(productPromoResponse.validFrom) + component.getTimeZone());
    expect(mock.request.body.validTo).toEqual(component.convertDateTime(productPromoResponse.validTo) + component.getTimeZone());
    expect(mock.request.body.products).toEqual(productPromoResponse.products);
    mock.flush(productPromoResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can edit a product promotion', () => {

    component.form.setValue({
      href: productPromoUpdatedResponse.href,
      name: productPromoUpdatedResponse.name,
      type: productPromoUpdatedResponse.type,
      amount: productPromoUpdatedResponse.amount,
      minimumOrderAmount: productPromoUpdatedResponse.minimumOrderAmount,
      maxAmount: productPromoUpdatedResponse.maxAmount,
      isExclusive: productPromoUpdatedResponse.isExclusive,
      isActive: productPromoUpdatedResponse.isActive,
      validFrom: component.convertDateTime(productPromoUpdatedResponse.validFrom) + component.getTimeZone(),
      validTo: component.convertDateTime(productPromoUpdatedResponse.validTo) + component.getTimeZone(),
      products: [],
      priority: productPromoUpdatedResponse.priority,
      banner: '',
      appliedOnOnline: 1,
      appliedOnOffline: 1,
      productBundlingBenefit: [],
      productBundlingCondition: [],
      multiplyItem: false
    });

    component.save();

    const mock = httpTestingController.expectOne(productPromoResponse.href);
    expect(mock.request.method).toEqual('PATCH');
    expect(mock.request.body.name).toBe(productPromoUpdatedResponse.name);
    expect(mock.request.body.type).toBe(productPromoUpdatedResponse.type);
    expect(mock.request.body.amount).toBe(productPromoUpdatedResponse.amount);
    expect(mock.request.body.minimumOrderAmount).toBe(productPromoUpdatedResponse.minimumOrderAmount);
    expect(mock.request.body.maxAmount).toBe(productPromoUpdatedResponse.maxAmount);
    expect(mock.request.body.isExclusive).toEqual(productPromoUpdatedResponse.isExclusive);
    expect(mock.request.body.isActive).toEqual(productPromoUpdatedResponse.isActive);
    expect(mock.request.body.validFrom).toEqual(component.convertDateTime(productPromoUpdatedResponse.validFrom) + component.getTimeZone());
    expect(mock.request.body.validTo).toEqual(component.convertDateTime(productPromoUpdatedResponse.validTo) + component.getTimeZone());
    mock.flush(productPromoUpdatedResponse, {status: 200, statusText: 'OK'});
    httpTestingController.verify();
  });

  it('can delete product promotion', () => {
    component.href.setValue(productPromoResponse.href);
    component.delete();

    const mock = httpTestingController.expectOne(productPromoResponse.href);
    expect(mock.request.method).toEqual('DELETE');
    mock.flush(null, {status: 204, statusText: 'No Content'});
    httpTestingController.verify();
  });

  it('can delete product promotion', () => {
    component.href.setValue(productPromoResponse.href);
    component.delete();

    const mock = httpTestingController.expectOne(productPromoResponse.href);
    expect(mock.request.method).toEqual('DELETE');
    mock.flush(null, {status: 204, statusText: 'No Content'});
    httpTestingController.verify();
  });

  it('can test for 400 error', () => {
    const errMsg = {
      errors: [
        'amount : Ensure that there are no more than 12 digits in total.',
        'max_amount : Ensure that there are no more than 12 digits in total.',
        'minimum_order_amount : Ensure that there are no more than 12 digits in total.'
      ],
      detail: 'amount : Ensure that there are no more than 12 digits in total.'
    };

    component.name.setValue('test');
    component.type.setValue(productPromoResponse.type);
    component.validFrom.setValue(productPromoResponse.validFrom);
    component.amount.setValue(10000000000000000);
    component.maxAmount.setValue(100000000000000000);
    component.minimumOrderAmount.setValue(1000000000000000000);

    service.save(component.getFormValue()).subscribe(data => fail('should have failed with the 400 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(400, 'status');
        expect(error.error).toEqual(errMsg, 'message');
      });

    const mock = httpTestingController.expectOne('/api/catalog/product-promotion/');
    mock.flush(errMsg, {status: 400, statusText: 'Bad Request'});
    httpTestingController.verify();
  });
});
