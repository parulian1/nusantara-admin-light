import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';

import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {OnboardingComponent, OnboardingContentHostComponent, OnboardingPreviewHostDialogComponent} from '@nusantara/pages/cms/onboarding';
import {SharedModule} from '@nusantara/shared';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxSmartModalModule} from 'ngx-smart-modal';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DragDropModule,
        NgxSmartModalModule.forChild(), ],
      declarations: [
        OnboardingComponent,
        OnboardingContentHostComponent,
        OnboardingPreviewHostDialogComponent ],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              typeChoices: [],
              entity: {}
            })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
