import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '@nusantara/shared';
import { WarehouseComponent } from '@nusantara/pages/config/warehouse';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { drf } from '@nusantara/models';

describe('WarehouseComponent', () => {
  let component: WarehouseComponent;
  let fixture: ComponentFixture<WarehouseComponent>;

  let httpTestingController: HttpTestingController;

  const warehouseResponse = {
    href: 'https://staging.bhisma.cloud/api/fulfillment/warehouse/taman-anggrek/',
    address: {
      country: 'id',
      province: 'daerah khusus ibukota jakarta',
      city: 'jakarta barat',
      district: 'grogol',
      subDistrict: 'grogol petamburan',
      street: 'Letjen S. Parman St No.28',
      postalCode: '11450',
      latitude: null,
      longitude: null,
      notes: ''
    },
    subLocations: [
      {
        href: 'https://staging.bhisma.cloud/api/fulfillment/sub-location/10/',
        name: 'default',
        code: 'default',
        type: 'omni_channel'
      },
      {
        href: 'https://staging.bhisma.cloud/api/fulfillment/sub-location/12/',
        name: 'Hold',
        code: 'hold',
        type: 'hold'
      },
      {
        href: 'https://staging.bhisma.cloud/api/fulfillment/sub-location/11/',
        name: 'Offline Only Stock',
        code: 'offline-only',
        type: 'offline_only'
      }
    ],
    name: 'Taman Anggrek',
    code: '10101',
    type: 'permanent',
    internalNotes: 'sasa',
    financialReportingAs: null,
    allowReassignmentFrom: [],
    isActive: true
  };

  const fakeResolvedData = {
    types: [],
    subLocationTypes: [],
    allWarehouses: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        WarehouseComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of(fakeResolvedData) },
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  // it('required field validity', () => {
  //   const name = component.name;
  //   const code = component.code;
  //   // const country = warehouseResponse.address.country;
  //
  //   name.setValue('');
  //   code.setValue('');
  //   // country.setValue('');
  //   // expect(name.hasError('required')).toBeTruthy();
  //   // expect(code.hasError('required')).toBeTruthy();
  //   // expect(address.hasError('required')).toBeTruthy();
  // });

});
