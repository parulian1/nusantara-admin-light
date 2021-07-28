import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DashboardModule } from '@nusantara/pages/dashboard';
import { DashboardComponent } from '@nusantara/pages/dashboard/dashboard.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const fakeResolvedData = { dashboard: { href: 'https://something/?foo=bar&titled=true', } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DashboardModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of(fakeResolvedData) },
        }
      ],
      declarations: [ DashboardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets metabase iframe url and replaces query param titled=true with titled=false', waitForAsync(() => {
    // get the full dom rendered by the component
    const iframe = fixture.debugElement.nativeElement.querySelector('iframe');
    expect(iframe.src).toEqual('https://something/?foo=bar&titled=false');

    // the above can **also** be tested like this since the component has an ElementRef
    expect(component.metabaseIframe.nativeElement.src).toEqual('https://something/?foo=bar&titled=false');
  }));
});
