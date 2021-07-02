import { ComponentFixture, TestBed } from '@angular/core/testing';
import {StockRecordDialogComponent} from '@nusantara/pages/inventory/adjustment/stock-record-dialog.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '@nusantara/shared';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';


describe('StockRecordDialogComponent', () => {
  let component: StockRecordDialogComponent;
  let fixture: ComponentFixture<StockRecordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [ StockRecordDialogComponent ],

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
