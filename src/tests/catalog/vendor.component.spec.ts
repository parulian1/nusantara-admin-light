import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@nusantara/shared';
import { VendorComponent } from '@nusantara/pages/catalog/vendor';

describe('VendorComponent', () => {
  let component: VendorComponent;
  let fixture: ComponentFixture<VendorComponent>;

  let httpTestingController: HttpTestingController;

  const vendorResponse = {
    href: 'http://localhost:8000/vendor/sasa-vendor02-2/',
    name: 'sasa vendor02',
    description: 'tes deskripsi vendor02',
    iconImage: null,
    bannerImage: null,
    productCount: 0,
    internalNotes: 'tes internal note vendor02'
  };

  const vendorUpdatedResponse = {
    href: 'http://localhost:8000/vendor/sasa-vendor02-2/',
    name: 'sasa vendor dua',
    description: 'tes deskripsi vendor dua',
    iconImage: null,
    bannerImage: null,
    productCount: 0,
    internalNotes: 'tes internal note vendor dua'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        VendorComponent,
      ],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(VendorComponent);
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

    name.setValue('');
    fixture.detectChanges();

    expect(name.hasError('required')).toBeTruthy();
  });

  it('can create a new vendor', () => {
    component.name.setValue(vendorResponse.name);
    component.description.setValue(vendorResponse.description);
    component.iconImage.setValue(vendorResponse.iconImage);
    component.bannerImage.setValue(vendorResponse.bannerImage);
    component.internalNotes.setValue(vendorResponse.internalNotes);

    component.save();

    const mock = httpTestingController.expectOne('/api/catalog/vendor/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.name).toBe(vendorResponse.name);
    expect(mock.request.body.description).toBe(vendorResponse.description);
    expect(mock.request.body.iconImage).toBe(vendorResponse.iconImage);
    expect(mock.request.body.bannerImage).toBe(vendorResponse.bannerImage);
    expect(mock.request.body.internalNotes).toBe(vendorResponse.internalNotes);
    mock.flush(vendorResponse, {status: 201, statusText: 'CREATED'});
    httpTestingController.verify();
  });

  it('can edit a vendor', () => {
    component.href.setValue(vendorResponse.href);
    component.name.setValue(vendorUpdatedResponse.name);
    component.description.setValue(vendorUpdatedResponse.description);
    component.iconImage.setValue(vendorUpdatedResponse.iconImage);
    component.bannerImage.setValue(vendorUpdatedResponse.bannerImage);
    component.internalNotes.setValue(vendorUpdatedResponse.internalNotes);

    component.save();

    const mock = httpTestingController.expectOne(vendorResponse.href);
    expect(mock.request.method).toEqual('PATCH');
    expect(mock.request.body.name).toBe(vendorUpdatedResponse.name);
    expect(mock.request.body.description).toBe(vendorUpdatedResponse.description);
    expect(mock.request.body.iconImage).toBe(vendorUpdatedResponse.iconImage);
    expect(mock.request.body.bannerImage).toBe(vendorUpdatedResponse.bannerImage);
    expect(mock.request.body.internalNotes).toBe(vendorUpdatedResponse.internalNotes);
    mock.flush(vendorUpdatedResponse, {status: 200, statusText: 'OK'});
    httpTestingController.verify();
  });

  it('can delete vendor', () => {
    component.href.setValue(vendorResponse.href);
    component.delete();
    const mock = httpTestingController.expectOne(vendorResponse.href);
    expect(mock.request.method).toEqual('DELETE');
    mock.flush(null, {status: 204, statusText: 'No Content'});
    httpTestingController.verify();
  });
});
