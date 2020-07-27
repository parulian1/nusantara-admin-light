import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractCrudService } from '@nusantara/core';
import { ITestimonial } from '@nusantara/models/widgets';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService extends AbstractCrudService<ITestimonial> {

  baseUrl = '/api/cms/testimonial';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
