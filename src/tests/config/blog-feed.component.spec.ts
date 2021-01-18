import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFeedComponent } from '@nusantara/pages/config/blog-feed/blog-feed.component';

describe('BlogFeedComponent', () => {
  let component: BlogFeedComponent;
  let fixture: ComponentFixture<BlogFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
