import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueComponent } from '@nusantara/pages/cms/catalogue/catalogue.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('CatalogueComponent', () => {
  let component: CatalogueComponent;
  let fixture: ComponentFixture<CatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            data: of({
              entity: {}
            }),
          }
        }
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
