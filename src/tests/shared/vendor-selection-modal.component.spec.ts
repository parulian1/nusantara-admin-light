import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {VendorSelectionModalComponent} from '@nusantara/shared/vendor-selection-modal/vendor-selection-modal.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {IVendor} from '@nusantara/models';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxSmartModalModule} from 'ngx-smart-modal';


describe('VendorSelectionModalComponent', () => {
  let component: VendorSelectionModalComponent;
  let fixture: ComponentFixture<VendorSelectionModalComponent>;

  let httpTestingController: HttpTestingController;

  const vendorResponse = [
    {
      href: 'http://localhost:8000/vendor/sasa-vendor01-2/',
      name: 'sasa vendor01',
      description: 'tes deskripsi vendor01',
      iconImage: null,
      bannerImage: null,
      productCount: 0,
      internalNotes: 'tes internal note vendor01'
    } as IVendor,
    {
      href: 'http://localhost:8000/vendor/sasa-vendor02-2/',
      name: 'sasa vendor02',
      description: 'tes deskripsi vendor02',
      iconImage: null,
      bannerImage: null,
      productCount: 0,
      internalNotes: 'tes internal note vendor02'
    } as IVendor,
  ];

  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgxSmartModalModule.forChild()
      ],
      declarations: [VendorSelectionModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(VendorSelectionModalComponent);
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
