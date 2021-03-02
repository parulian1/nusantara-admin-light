import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@nusantara/shared';
import {ContentFooterComponent} from '@nusantara/pages/cms/content-footer';


describe('ContentFooterComponent', () => {
  let component: ContentFooterComponent;
  let fixture: ComponentFixture<ContentFooterComponent>;

  let httpTestingController: HttpTestingController;

  const contentFooterResponseData = {
    title: 'My Content Footer',
    position: 'first-child',
    isActive: true,
    href: 'https://staging.bhisma.cloud/api/cms/navigation/content_footer/item/'
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
        ContentFooterComponent,
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContentFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be invalid when validate form fields that are required', () => {
    component.title.setValue('');
    component.position.setValue('');
    component.isActive.setValue('');

    expect(component.form.valid).toBeFalsy();
  });


  it('should be success create new content footer', () => {
    // required form fields need to be filled
    component.title.setValue(contentFooterResponseData.title);
    component.position.setValue(contentFooterResponseData.position);
    component.isActive.setValue(contentFooterResponseData.isActive);
    component.save();

    const mock = httpTestingController.expectOne('/api/cms/navigation/content_footer/item/');
    expect(mock.request.method).toEqual('POST');
    expect(mock.request.body.title).toBe(contentFooterResponseData.title);
    expect(mock.request.body.position).toBe(contentFooterResponseData.position);
    expect(mock.request.body.isActive).toBe(contentFooterResponseData.isActive);
    httpTestingController.verify();
  });

  it('should be success to update a content footer', () => {
    component.href.setValue(contentFooterResponseData.href);
    component.title.setValue(contentFooterResponseData.title);
    component.position.setValue(contentFooterResponseData.position);
    component.isActive.setValue(contentFooterResponseData.isActive);
    component.save();

    const mock = httpTestingController.expectOne(contentFooterResponseData.href);
    expect(mock.request.method).toEqual('PATCH');
    expect(mock.request.body.title).toBe(contentFooterResponseData.title);
    expect(mock.request.body.position).toBe(contentFooterResponseData.position);
    expect(mock.request.body.isActive).toBe(contentFooterResponseData.isActive);
    httpTestingController.verify();
  });

  it('should be success to delete a content footer', () => {
    component.href.setValue(contentFooterResponseData.href);
    component.delete();

    const mock = httpTestingController.expectOne(contentFooterResponseData.href);
    expect(mock.request.method).toEqual('DELETE');
    mock.flush(null, {status: 204, statusText: 'No Content'});
    httpTestingController.verify();
  });
});
