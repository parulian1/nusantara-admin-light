import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonWrapperComponent } from '@nusantara/view-wrappers/anon-wrapper.component';

describe('AnonWrapperComponent', () => {
  let component: AnonWrapperComponent;
  let fixture: ComponentFixture<AnonWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
