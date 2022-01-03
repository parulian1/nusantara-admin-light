import { TestBed } from '@angular/core/testing';

import { AppUpdateService } from './app-update.service';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('AppUpdateService', () => {
  let service: AppUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [

        ServiceWorkerModule.register('', {enabled: false}),
      ]
    });
    service = TestBed.inject(AppUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
