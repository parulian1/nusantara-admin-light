import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@nusantara/shared';
import { CategoryComponent } from '@nusantara/pages/catalog/category';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  let httpTestingController: HttpTestingController;

  const categoryResp = {
    name: 'test add category',
    pathName: 'can you delete meh 24k',
    productCount: 0,
    depth: 1,
    sourceMappings: [],
    href: 'https://staging.bhisma.cloud/api/catalog/category/test-add-category/',
    image: null,
    parent: null
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        CategoryComponent,
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.form.controls.name.setValue('');
    component.form.controls.href.setValue('');
    component.form.controls.image.setValue('');
    component.form.controls.parent.setValue('');
    component.form.controls.sourceMappings.setValue([]);
    expect(component.form.valid).toBeFalsy();
  });

  it('name field validity', () => {
    const name = component.form.controls.name;
    expect(name.valid).toBeFalsy();

    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
  });

  it('can create a new category', () => {

    component.name.setValue('test add category');
    component.saveAsForm();

    const mock = httpTestingController.expectOne('/api/catalog/category/');
    expect(mock.request.method).toEqual('POST');
    expect(component.form.controls.name.value).toBe('test add category');
    mock.flush(categoryResp);
    httpTestingController.verify();
  });

  it('can edit a category', () => {

    component.href.setValue(categoryResp.href);
    component.name.setValue('test add category edited');
    component.saveAsForm();

    const mock = httpTestingController.expectOne(categoryResp.href);
    expect(mock.request.method).toEqual('PATCH');
    expect(component.form.controls.name.value).toBe('test add category edited');
    mock.flush(categoryResp);
    httpTestingController.verify();
  });

  it('should call delete method', () => {
    spyOn(component, 'delete');
    component.href.setValue(categoryResp.href);
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.nativeElement.querySelector('.danger');
    deleteButton.click();

    expect(component.delete).toHaveBeenCalledTimes(1);
  });
});
