import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectionModalComponent } from '@nusantara/shared/modals/category-selection-modal.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSmartModalModule} from 'ngx-smart-modal';

describe('CategorySelectionModalComponent', () => {
  let component: CategorySelectionModalComponent;
  let fixture: ComponentFixture<CategorySelectionModalComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgxSmartModalModule.forChild()
      ],
      declarations: [ CategorySelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CategorySelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });
});
