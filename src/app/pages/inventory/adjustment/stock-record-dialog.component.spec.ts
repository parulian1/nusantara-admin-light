import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRecordDialogComponent } from './stock-record-dialog.component';

describe('StockRecordDialogComponent', () => {
  let component: StockRecordDialogComponent;
  let fixture: ComponentFixture<StockRecordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockRecordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockRecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
