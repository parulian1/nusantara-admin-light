import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectionModalComponent } from '@nusantara/shared/modals/category-selection-modal.component';

describe('CategorySelectionModalComponent', () => {
  let component: CategorySelectionModalComponent;
  let fixture: ComponentFixture<CategorySelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategorySelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorySelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
