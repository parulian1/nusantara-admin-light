import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseMappingListComponent } from './warehouse-mapping-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormBuilder} from '@angular/forms';
import {SiteConfigService} from '@nusantara/services';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';

describe('WarehouseMappingListComponent', () => {
  let component: WarehouseMappingListComponent;
  let fixture: ComponentFixture<WarehouseMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [ WarehouseMappingListComponent ],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              page: []
            })
          }
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehouseMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
