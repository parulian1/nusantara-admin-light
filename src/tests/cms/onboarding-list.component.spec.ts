import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import {OnboardingListComponent} from '@nusantara/pages/cms/onboarding';
import {of} from 'rxjs';

describe('OnboardingListComponent', () => {
  let component: OnboardingListComponent;
  let fixture: ComponentFixture<OnboardingListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingListComponent ],
      providers: [ HttpClientTestingModule,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              page: {},
            })
          }
        }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
