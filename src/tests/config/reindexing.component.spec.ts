import { ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ReindexingComponent} from '@nusantara/pages/config/reindexing/reindexing.component';
import {ReindexingService} from '@nusantara/pages/config/reindexing/reindexing.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';


describe('ReindexingComponent', () => {
  let component: ReindexingComponent;
  let reindexingService: jasmine.SpyObj<ReindexingService>;
  let fixture: ComponentFixture<ReindexingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [ReindexingComponent],
      providers: [
        ReindexingService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              data: {
                get: () => ''
              },
            }),
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReindexingComponent);
    component = fixture.componentInstance;
    reindexingService = TestBed.inject(ReindexingService) as jasmine.SpyObj<ReindexingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
