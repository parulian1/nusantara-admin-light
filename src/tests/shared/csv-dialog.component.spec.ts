import { ComponentFixture, TestBed } from '@angular/core/testing';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '@nusantara/shared';
import {CsvDialogComponent} from '@nusantara/shared/csv-dialog/csv-dialog.component';

describe('CsvDialogComponent', () => {
  let component: CsvDialogComponent;
  let fixture: ComponentFixture<CsvDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [ CsvDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
