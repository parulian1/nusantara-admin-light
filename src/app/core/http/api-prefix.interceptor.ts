import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url)) {
      let url = `//${window.localStorage.getItem('site_domain')}` + request.url;
      // TODO: need better hack for this
      // for now, force https for non localhost url
      if (!/^\/\/(localhost):/i.test(url)) {
          url = 'https:' + url;
      }
      request = request.clone({ url });
    }
    return next.handle(request);
  }
}
