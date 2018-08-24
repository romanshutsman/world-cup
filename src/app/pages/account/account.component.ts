import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, NgForm, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../services/auth/authentication.service';
import {ApiService} from '../../services/api/api.service';
import {NotificationService} from '../../services/notification/notification.service';
import {injectViewContainerRef} from '@angular/core/src/render3/instructions';
import { NavigationEnd } from '@angular/router/src/events';

@Component({
  selector: 'app-test',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {
  @ViewChild('inputTag') inputTag: ElementRef;

  public email: string;
  public name: string;
  public userId: string;
  public emails: any = [];
  public activeTab = false;
  public unreadMsg = [];
  myTiers: any = [];




  constructor(public auth: AuthenticationService,
              public router: Router,
              private myHttp: ApiService) {
    if (auth.isAuthenticated() && auth.getUser().verify) {
      this.email = auth.getUser().email;
      this.userId = auth.getUser().userId;
      this.name = JSON.parse(localStorage.getItem('user')).name;
    } else if (auth.isAuthenticated() && !auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    } else {
      this.router.navigate(['/login']);
    }

    router.events.subscribe((val: NavigationEnd) => {
      if ( val.url) {
        if (val.url == '/account/user-tier/invitation') {
          this.activeTab = true;
        } else if (val.url == '/account/user-tier/my-tiers') {
          this.activeTab = true;
        } else {
          this.activeTab = false;
        }
      }
    });
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.showNotification();
    }
  }

  showNotification() {
    this.myHttp.notification().subscribe(
      (arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].status !== 'read') {
            if (arr[i].type === 'invitation') {
              this.unreadMsg.push(arr[i].type);
            }
            if (arr[i].type === 'info') {
              this.unreadMsg.push(arr[i].type);
            }
          }
        }
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/desktop']);
  }
}
