import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { catchError, tap } from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {JwtHelper } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {Subject} from 'rxjs/Subject';
import {NotificationService} from '../notification/notification.service';



@Injectable()
export class AuthenticationService {
  
  clickedBuyTicket = new Subject<boolean>();
  toggleUsersTiers = new Subject<boolean>();
  toggleCreateTiers = new Subject<boolean>();
  toggleLog = new Subject<boolean>();
  chooseLang = new Subject<any>();
  jwtHelper: JwtHelper = new JwtHelper();
  public token: string;
  
  constructor(private api: ApiService,
    private notificationService: NotificationService) {
      this.isVerified();
    }
    
  public getToken(): any {
    return JSON.parse(localStorage.getItem('token'));
  }

  public setToken(token): any {
    localStorage.setItem('token', JSON.stringify(token));
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
      return refresh_token != null && !this.jwtHelper.isTokenExpired(refresh_token);
    } else {
      return false;
    }
  };
  public isVerified(): boolean {
    const token = this.getToken();
    if (token) {
      return this.jwtHelper.decodeToken(token).verify;
    }
  }

  public getUser(): any {
    if (this.getToken()) {
      return this.jwtHelper.decodeToken(this.getToken());
    }
  }

  login(email: string, password: string): any {
    let body = {
      email: email,
      password: password
    };
    return this.api.login(body)
    .pipe(
      tap( (result: any) => {
        if (result && result.token) {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', JSON.stringify(result.token));
          localStorage.setItem('refresh_token', JSON.stringify(result.refreshToken));
          localStorage.setItem('log', JSON.stringify(true));
        }
      }),
      catchError(this.handleError)
    );

  }

  register(email: string, name: string, password: string): any {
    let body = {
      email: email,
      name: name,
      password: password
    };
    return this.api.register(body)
    .pipe(
      tap( (result: any) => {
        console.log(result);
      }),
      catchError(this.handleError)
    );
  }

  getRefreshToken(): Observable<string> {
    let refresh_token = JSON.parse(localStorage.getItem('refresh_token'));
    return this.api.token(refresh_token)
      .map((refreshResponse: any) => {
        this.setToken(refreshResponse.token);
        localStorage.setItem('refresh_token', JSON.stringify(refreshResponse.refreshToken));
        localStorage.setItem('token', JSON.stringify(refreshResponse.token));
        return refreshResponse.token;
    });
  }

  forgotPassword(email: string): any {
    let body = {
      email: email
    };
    return this.api.forgotPassword(body)
    .pipe(
      tap( (result: any) => {
        console.log(result);
      }),
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, password: string): any {
    let body = {
      token: token,
      newPassword: password
    };
    return this.api.resetPassword(body)
    .pipe(
      tap( (result: any) => {
        console.log(result);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    // localStorage.removeItem('tog');
    localStorage.setItem('log', JSON.stringify(false));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(error.error.message);
  }

}
