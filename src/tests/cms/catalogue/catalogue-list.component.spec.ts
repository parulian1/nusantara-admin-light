import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueListComponent } from '@nusantara/pages/cms/catalogue/catalogue-list.component';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CatalogueListComponent', () => {
  let component: CatalogueListComponent;
  let fixture: ComponentFixture<CatalogueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueListComponent ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              page: {}
            })
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
