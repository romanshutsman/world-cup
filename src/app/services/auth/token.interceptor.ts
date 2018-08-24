import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import {Router} from '@angular/router';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public refreshToket = false;

  constructor(public auth: AuthenticationService, public router: Router) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    return next.handle(this.addToken(request, token))
    .catch((error) => {
      let failedRequests = [];
      if (error.status === 401 && !this.refreshToket) {
        this.refreshToket = true;
        return this.auth.getRefreshToken()
        .flatMap(updatedToken => {
          if (updatedToken) {
            this.refreshToket = false;
            failedRequests.forEach(req => {
              next.handle(this.addToken(req, updatedToken));
            });
            return next.handle(this.addToken(request, updatedToken));
          }else {
            this.refreshToket = false;
            this.auth.logout();
          }
        })
        .catch(() => {
          this.refreshToket = false;
          this.auth.logout();
          this.router.navigate(['/login']);
          return Observable.throw(error);
        });
      }else if (error.status === 401) {
        failedRequests.push(request);
      }
      // return all others errors
      return Observable.throw(error);
    }) as any;
  }
}
