import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

import {CategoryComponent} from '@nusantara/pages/catalog/category';
import {SharedModule} from '@nusantara/shared';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {

    // // Create a fake CategoryService object with a `fetchAvailableParentCategories()` spy
    // const CategoryService = jasmine.createSpyObj('CategoryService', ['fetchAvailableParentCategories']);

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
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can create a new category', () => {
    const categoryResp = {
      name: 'test add category',
      pathName: 'can you delete meh 24k',
      productCount: 0,
      depth: 1,
      sourceMappings: [],
      href: 'https://staging.bhisma.cloud/api/catalog/category/can-you-delete-meh-24k/',
      image: 'https://cdn.bhisma.cloud/catalog/category/avener-icon.png',
      parent: null
    };

    component.name.setValue('test add category');
    component.saveAsForm();

    const mock = httpTestingController.expectOne('/api/catalog/category/');
    expect(mock.request.method).toEqual('POST');
    expect(component.form.controls.name.value).toBe('test add category');
    mock.flush(categoryResp);
  });
});
