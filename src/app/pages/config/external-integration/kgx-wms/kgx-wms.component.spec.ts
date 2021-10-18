import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgxWmsComponent } from './kgx-wms.component';

describe('KgxWmsComponent', () => {
  let component: KgxWmsComponent;
  let fixture: ComponentFixture<KgxWmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KgxWmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KgxWmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
