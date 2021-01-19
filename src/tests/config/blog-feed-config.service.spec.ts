import { TestBed } from '@angular/core/testing';

import { BlogFeedConfigService } from '@nusantara/services/blog-feed-config.service';

describe('BlogFeedConfigService', () => {
  let service: BlogFeedConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogFeedConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
