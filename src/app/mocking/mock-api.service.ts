import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PRODUCT_CLASSES_GET_RESPONSES } from './catalog-product-classes.data';
import { PRODUCT_GET_RESPONSES } from './catalog-product.data';
import { CATEGORY_GET_RESPONSES } from './catalog-categories.data';

/**
 * This is here to provide design-time data, when the API is not available.
 * If there **not** yet a documented API for a given endpoint, the best-guess
 * effort is made based on the frontend data requirements.
 */
@Injectable()
export class MockApiInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log(`Attempting to Mock API Response for HTTP ${request.method} ${request.url}`);

    if (request.method in HTTP_API_RESPONSES &&
        request.url in HTTP_API_RESPONSES[request.method]) {

      console.log('Returning Mock data');

      return of(new HttpResponse(HTTP_API_RESPONSES[request.method][request.url]));
    }

    console.log('Mock data not found!  Calling real service');

    return next.handle(request);
  }
}

const HTTP_API_RESPONSES = {
  GET: {
    ...CATEGORY_GET_RESPONSES,
    // ...PRODUCT_CLASSES_GET_RESPONSES,
    ...PRODUCT_GET_RESPONSES,
  },
};
