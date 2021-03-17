import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@nusantara/shared';
import { CustomerGroupDetailComponent } from '@nusantara/pages/users/customer-group';

describe('CustomerGroupDetailComponent', () => {
  let component: CustomerGroupDetailComponent;
  let fixture: ComponentFixture<CustomerGroupDetailComponent>;

  let httpTestingController: HttpTestingController;

  const CustomerGroupManualTypeResponse = {
    name: 'delete meh',
    href: 'https://staging.bhisma.cloud/api/iam/customer-group/delete-meh/',
    userCount: 0,
    type: 'manual',
    amountThreshold: null,
    timeThreshold: null,
    customers: [
      {
        email: 'thomas123456789@mailinator.com',
        href: 'https://staging.bhisma.cloud/api/iam/user/thomas123456789/'
      }
    ]
  };

  const CustomerGroupNewlyRegisteredTypeResponse = {
    name: 'delete meh',
    href: 'https://staging.bhisma.cloud/api/iam/customer-group/delete-meh/',
    userCount: 0,
    type: 'new',
    amountThreshold: null,
    timeThreshold: 'P1D'
};

  const CustomerGroupBeforeCertainDateTypeResponse = {
    name: 'delete meh',
    href: 'https://staging.bhisma.cloud/api/iam/customer-group/delete-meh/',
    userCount: 0,
    type: 'existing',
    amountThreshold: null,
    timeThreshold: 'P1D'
};

  const CustomerGroupLTVTypeResponse = {
    name: 'delete meh',
    href: 'https://staging.bhisma.cloud/api/iam/customer-group/delete-meh/',
    userCount: 0,
    type: 'ltv',
    amountThreshold: 20000,
    timeThreshold: 'null'
};

  const CustomerGroupChurnedTypeResponse = {
    name: 'delete meh',
    href: 'https://staging.bhisma.cloud/api/iam/customer-group/delete-meh/',
    userCount: 0,
    type: 'churned',
    amountThreshold: null,
    timeThreshold: 'P2D'
};

  const CustomerGroupChangedTypeResponse = {
    name: 'updated name',
    href: 'https://staging.bhisma.cloud/api/iam/customer-group/delete-meh/',
    userCount: 0,
    type: 'ltv',
    amountThreshold: 30000,
    timeThreshold: null
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
        CustomerGroupDetailComponent,
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CustomerGroupDetailComponent);
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
    const amountThreshold = component.form.controls.type;
    const timeThreshold = component.form.controls.type;
    expect(name.valid).toBeFalsy();
    expect(type.valid).toBeFalsy();
    expect(amountThreshold.valid).toBeFalsy();
    expect(timeThreshold.valid).toBeFalsy();

    name.setValue('');
    type.setValue('');
    amountThreshold.setValue('');
    timeThreshold.setValue('');
    expect(name.hasError('required')).toBeTruthy();
    expect(type.hasError('required')).toBeTruthy();
    expect(amountThreshold.hasError('required')).toBeTruthy();
    expect(timeThreshold.hasError('required')).toBeTruthy();
  });

  it('field minimum value', () => {
    component.type.setValue('ltv');
    component.amountThreshold.setValue(-1);
    expect(component.amountThreshold.hasError('min')).toBeTruthy();

    component.type.setValue('new');
    component.timeThreshold.setValue(-1);
    expect(component.timeThreshold.hasError('min')).toBeTruthy();
  });

  it('can create a new customer group with manual type', () => {
    component.form.setValue({
      href: '',
      name: CustomerGroupManualTypeResponse.name,
      type: CustomerGroupManualTypeResponse.type,
      amountThreshold: CustomerGroupManualTypeResponse.amountThreshold,
      timeThreshold: CustomerGroupManualTypeResponse.timeThreshold,
      customers: []
    });
    component.save();

    const mock = httpTestingController.expectOne('/api/iam/customer-group/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(CustomerGroupManualTypeResponse.name);
    expect(mock.request.body.type).toBe(CustomerGroupManualTypeResponse.type);
    mock.flush(CustomerGroupManualTypeResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can create a new customer group with newly registered type', () => {
    component.form.setValue({
      href: '',
      name: CustomerGroupNewlyRegisteredTypeResponse.name,
      type: CustomerGroupNewlyRegisteredTypeResponse.type,
      amountThreshold: CustomerGroupNewlyRegisteredTypeResponse.amountThreshold,
      timeThreshold: CustomerGroupNewlyRegisteredTypeResponse.timeThreshold,
      customers: []
    });
    component.save();

    const mock = httpTestingController.expectOne('/api/iam/customer-group/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(CustomerGroupNewlyRegisteredTypeResponse.name);
    expect(mock.request.body.type).toBe(CustomerGroupNewlyRegisteredTypeResponse.type);
    expect(mock.request.body.timeThreshold).toBe(CustomerGroupNewlyRegisteredTypeResponse.timeThreshold);
    mock.flush(CustomerGroupNewlyRegisteredTypeResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can create a new customer group registered before a certain date type', () => {
    component.form.setValue({
      href: '',
      name: CustomerGroupBeforeCertainDateTypeResponse.name,
      type: CustomerGroupBeforeCertainDateTypeResponse.type,
      amountThreshold: CustomerGroupBeforeCertainDateTypeResponse.amountThreshold,
      timeThreshold: CustomerGroupBeforeCertainDateTypeResponse.timeThreshold,
      customers: []
    });
    component.save();

    const mock = httpTestingController.expectOne('/api/iam/customer-group/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(CustomerGroupBeforeCertainDateTypeResponse.name);
    expect(mock.request.body.type).toBe(CustomerGroupBeforeCertainDateTypeResponse.type);
    expect(mock.request.body.timeThreshold).toBe(CustomerGroupBeforeCertainDateTypeResponse.timeThreshold);
    mock.flush(CustomerGroupBeforeCertainDateTypeResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can create a new customer group have purchased over certain amount type', () => {
    component.form.setValue({
      href: '',
      name: CustomerGroupLTVTypeResponse.name,
      type: CustomerGroupLTVTypeResponse.type,
      amountThreshold: CustomerGroupLTVTypeResponse.amountThreshold,
      timeThreshold: CustomerGroupLTVTypeResponse.timeThreshold,
      customers: []
    });
    component.save();

    const mock = httpTestingController.expectOne('/api/iam/customer-group/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(CustomerGroupLTVTypeResponse.name);
    expect(mock.request.body.type).toBe(CustomerGroupLTVTypeResponse.type);
    expect(mock.request.body.amountThreshold).toBe(CustomerGroupLTVTypeResponse.amountThreshold);
    mock.flush(CustomerGroupLTVTypeResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can create a new customer group have not made a purchase', () => {
    component.form.setValue({
      href: '',
      name: CustomerGroupChurnedTypeResponse.name,
      type: CustomerGroupChurnedTypeResponse.type,
      amountThreshold: CustomerGroupChurnedTypeResponse.amountThreshold,
      timeThreshold: '2',
      customers: []
    });
    component.save();

    const mock = httpTestingController.expectOne('/api/iam/customer-group/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(CustomerGroupChurnedTypeResponse.name);
    expect(mock.request.body.type).toBe(CustomerGroupChurnedTypeResponse.type);
    expect(mock.request.body.timeThreshold).toBe(CustomerGroupChurnedTypeResponse.timeThreshold);
    mock.flush(CustomerGroupChurnedTypeResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can edit customer group', () => {

    component.href.setValue(CustomerGroupChangedTypeResponse.href);
    component.name.setValue(CustomerGroupChangedTypeResponse.name);
    component.type.setValue(CustomerGroupChangedTypeResponse.type);
    component.amountThreshold.setValue(CustomerGroupChangedTypeResponse.amountThreshold);
    component.save();

    const mock = httpTestingController.expectOne(CustomerGroupChangedTypeResponse.href);
    expect(mock.request.method).toEqual('PATCH');
    expect(mock.request.body.name).toBe(CustomerGroupChangedTypeResponse.name);
    expect(mock.request.body.type).toBe(CustomerGroupChangedTypeResponse.type);
    expect(mock.request.body.amountThreshold).toBe(CustomerGroupChangedTypeResponse.amountThreshold);
    mock.flush(CustomerGroupChangedTypeResponse, {status: 200, statusText: 'OK'});
    httpTestingController.verify();
  });

  it('can delete customer group', () => {
    component.href.setValue(CustomerGroupManualTypeResponse.href);
    component.delete();

    const mock = httpTestingController.expectOne(CustomerGroupManualTypeResponse.href);
    expect(mock.request.method).toEqual('DELETE');
    mock.flush(null, {status: 204, statusText: 'No Content'});
    httpTestingController.verify();
  });


  describe('timeThreshold value is iso8601', () => {
    it('should be timeThreshold default value is `P0D`', () => {
      const formValue = component.getFormValue();
      expect(formValue.timeThreshold).toEqual('P0D');
    });

    it('should be timeThreshold value is 0 is `P0D`', () => {
      component.timeThreshold.setValue(0);
      const formValue = component.getFormValue();
      expect(formValue.timeThreshold).toEqual('P0D');
    });

    it('should be timeThreshold value is greater than 0 is `P{value}D`', () => {
      component.timeThreshold.setValue(10);
      const formValue = component.getFormValue();
      expect(formValue.timeThreshold).toEqual('P10D');
    });
  });
});
