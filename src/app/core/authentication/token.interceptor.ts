import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {CredentialsService} from '@app/core';
import { Observable } from "rxjs";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public credentialsService: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.credentialsService.isAuthenticated()) {
      // todo -- check for expiry!
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.credentialsService.token}`
        }
      });
    }

    return next.handle(request);
  }
}
