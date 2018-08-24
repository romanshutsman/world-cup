import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isAuthenticated() && this.auth.isVerified()) {
      return true;
    }else if (this.router.url !== '/desktop') {
      if (!this.auth.isVerified()) {
        this.router.navigate(['/confirm-email']);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
        if (!this.auth.isVerified()) {
          this.router.navigate(['/confirm-email']);
        } else {
          this.router.navigate(['/login']);
        }
    }
  }

  canActivateChild() {
    if (this.auth.isAuthenticated()) {
      return true;
    }else if (this.router.url !== '/desktop') {
      this.router.navigate(['/login']);
    }
  }
}
