import { Injectable } from '@angular/core';

import { AbstractDetailResolver } from '@nusantara/core';
import { ITestimonial } from '@nusantara/models/widgets';
import { TestimonialService } from '@nusantara/services';

@Injectable({
  providedIn: 'root',
})
export class TestimonialResolver extends AbstractDetailResolver<ITestimonial> {
  constructor(service: TestimonialService) { super(service); }
}
