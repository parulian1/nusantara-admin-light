import { Injectable } from '@angular/core';

import { AbstractListResolver } from '@nusantara/core';
import { ITestimonial } from '@nusantara/models/widgets';
import { TestimonialService } from '@nusantara/services';

@Injectable({
  providedIn: 'root'
})
export class TestimonialListResolver extends AbstractListResolver<ITestimonial> {
  constructor(service: TestimonialService) { super(service); }
}
