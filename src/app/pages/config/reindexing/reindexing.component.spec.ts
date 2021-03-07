import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReindexingComponent } from './reindexing.component';

describe('ReindexingComponent', () => {
  let component: ReindexingComponent;
  let fixture: ComponentFixture<ReindexingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReindexingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReindexingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
