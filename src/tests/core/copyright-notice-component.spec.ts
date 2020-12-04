import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CopyrightNoticeComponent, CoreModule } from '@nusantara/core';
import { environment } from '@env/environment';

describe('CopyrightNoticeComponent', () => {
  let component: CopyrightNoticeComponent;
  let fixture: ComponentFixture<CopyrightNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule,
      ],
      providers: [ ],
      declarations: [ CopyrightNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyrightNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the current year', () => {
    const currentYear = (new Date()).getFullYear();
    expect(component.currentYear).toEqual(currentYear);
  });

  it('reports the version string as vX.Y.Z[-dev]', () => {
    let expectedVer = `v${environment.appVersion}`;
    if (!environment.production) {
      expectedVer += '-dev';
    }
    expect(component.currentVersion).toBe(expectedVer);
  });
});
