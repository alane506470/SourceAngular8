import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const kcToken = localStorage.getItem('kc_token');

    if (kcToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + kcToken)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
