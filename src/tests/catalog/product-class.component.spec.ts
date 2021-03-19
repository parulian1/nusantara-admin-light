import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

import {SharedModule} from '@nusantara/shared';
import {ProductClassComponent} from '@nusantara/pages/catalog/product-class';
import {ProductClassAttributesComponent} from '@nusantara/pages/catalog/product-class/components';
import {ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params} from '@angular/router';
import {Observable, of, ReplaySubject} from 'rxjs';
import {drf, products} from '@nusantara/models';

class ActivatedRouteStub implements Partial<ActivatedRoute> {
  private _paramMap: ParamMap;
  private subject = new ReplaySubject<ParamMap>();

  paramMap = this.subject.asObservable();
  get snapshot(): ActivatedRouteSnapshot {
    const snapshot: Partial<ActivatedRouteSnapshot> = {
      paramMap: this._paramMap,
    };

    return snapshot as ActivatedRouteSnapshot;
  }

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  setParamMap(params?: Params) {
    const paramMap = convertToParamMap(params);
    this._paramMap = paramMap;
    this.subject.next(paramMap);
  }
}

describe('ProductClassComponent', () => {
  let component: ProductClassComponent;
  let fixture: ComponentFixture<ProductClassComponent>;

  let httpTestingController: HttpTestingController;

  const productClassResponse = {
    name: 'sasa3',
    href: 'https://staging.bhisma.cloud/api/catalog/product-class/sasa3/',
    type: 'physical',
    requiresShipping: true,
    trackStock: true,
    isPerishable: false,
    attributes: [],
    productCount: 0
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        ProductClassComponent,
        ProductClassAttributesComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              typeChoices: [],
              attributeTypeChoices: [],
              entity: {},
              optionChoices: []
            })
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ProductClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.form.controls.name.setValue('');
    component.form.controls.type.setValue('');
    component.form.controls.requiresShipping.setValue('');
    component.form.controls.trackStock.setValue('');
    component.form.controls.isPerishable.setValue('');
    component.form.controls.attributes.setValue([]);
    expect(component.form.valid).toBeFalsy();
  });

  it('name field validity', waitForAsync(() => {
    const name = component.form.controls.name;
    const type = component.form.controls.type;
    expect(name.valid).toBeFalsy();
    expect(type.valid).toBeFalsy();

    name.setValue('');
    type.setValue('');
    expect(name.hasError('required')).toBeTruthy();
    expect(type.hasError('required')).toBeTruthy();
  }));

  it('can create a new product class', () => {

    component.name.setValue(productClassResponse.name);
    component.type.setValue(productClassResponse.type);
    component.requiresShipping.setValue(productClassResponse.requiresShipping);
    component.trackStock.setValue(productClassResponse.trackStock);
    component.isPerishable.setValue(productClassResponse.isPerishable);
    component.attributes.setValue(productClassResponse.attributes);
    component.save();

    const mock = httpTestingController.expectOne('/api/catalog/product-class/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(productClassResponse.name);
    expect(mock.request.body.type).toBe(productClassResponse.type);
    expect(mock.request.body.requiresShipping).toBe(productClassResponse.requiresShipping);
    expect(mock.request.body.trackStock).toBe(productClassResponse.trackStock);
    expect(mock.request.body.isPerishable).toBe(productClassResponse.isPerishable);
    expect(mock.request.body.attributes).toEqual(productClassResponse.attributes);
    mock.flush(productClassResponse);
    httpTestingController.verify();
  });

  it('can edit a product class', () => {

    component.href.setValue(productClassResponse.href);
    component.name.setValue('sasa4');
    component.type.setValue('subscription');
    component.requiresShipping.setValue(false);
    component.trackStock.setValue(false);
    component.isPerishable.setValue(true);
    component.attributes.setValue(productClassResponse.attributes);
    component.save();

    const mock = httpTestingController.expectOne(productClassResponse.href);
    expect(mock.request.method).toEqual('PATCH');
    expect(mock.request.body.name).toBe('sasa4');
    expect(mock.request.body.type).toBe('subscription');
    expect(mock.request.body.requiresShipping).toBe(false);
    expect(mock.request.body.trackStock).toBe(false);
    expect(mock.request.body.isPerishable).toBe(true);
    expect(mock.request.body.attributes).toEqual(productClassResponse.attributes);
    mock.flush(productClassResponse);
    httpTestingController.verify();
  });

  it('can delete product class', () => {
    component.href.setValue(productClassResponse.href);
    component.delete();

    const mock = httpTestingController.expectOne(productClassResponse.href);
    expect(mock.request.method).toEqual('DELETE');
    mock.flush(null, {status: 204, statusText: 'No Content'});
    httpTestingController.verify();
  });

  it('product class with DIGITAL type should have requiresShipping, trackStock, & isPerishable is false', () => {

    component.name.setValue(productClassResponse.name);
    component.type.setValue('digital');
    component.attributes.setValue(productClassResponse.attributes);
    component.save();

    const mock = httpTestingController.expectOne('/api/catalog/product-class/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(productClassResponse.name);
    expect(mock.request.body.type).toBe('digital');
    expect(mock.request.body.requiresShipping).toBe(false);
    expect(mock.request.body.trackStock).toBe(false);
    expect(mock.request.body.isPerishable).toBe(false);
    expect(mock.request.body.attributes).toEqual(productClassResponse.attributes);
    mock.flush(productClassResponse);
    httpTestingController.verify();
  });

  it('field cant input more than 50 character', () => {
    component.name.setValue('123456789012345678901234567890123456789012345678901');

    expect(component.name.errors.maxlength).toBeTruthy();
  });

});
