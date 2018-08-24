import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isAuthenticated() && this.auth.getUser().admin) {
      return true;
    }else {
      this.router.navigate(['/404']);
    }
  }
}
