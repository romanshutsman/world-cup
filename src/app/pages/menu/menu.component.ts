import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Renderer2, AfterViewInit, DoCheck } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthenticationService } from '../../services/auth/authentication.service';
import { Router, ActivatedRoute} from '@angular/router';
import { $ } from 'jquery';
import {NotificationService} from '../../services/notification/notification.service';
declare var $: any;
import { NavigationEnd } from '@angular/router/src/events';
import {ApiService} from '../../services/api/api.service';
import { DesktopComponent } from './../desktop/desktop.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit, DoCheck {
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('dropdownlink') dropdownlink: ElementRef;
  @ViewChild('drop') drop: ElementRef;
  @ViewChild('form') form: ElementRef;

  authenticated: boolean;
  subscriptionClick: Subscription;
  showStyle = false;
  public errorMessage;
  public loginForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public logged: boolean;
  public admin: boolean;
  public games;
  public toggleLog;
  public widthScreen;
  public activeTab = false;
  public unreadMsg = [];


  constructor(public auth: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private renderer: Renderer2,
              private notificationService: NotificationService,
              private http: ApiService,
              private desk: DesktopComponent
            ) {
    this.authenticated = this.auth.isAuthenticated();
    if (this.authenticated) {
      this.logged = true;
      this.admin = this.auth.getUser().admin;
    } else {

    }
    this.loginForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(
        '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'' +
        '*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
      )])],
      'password': [
        '',
        Validators.compose(
          [Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16)
          ])
      ]
    });
    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
    router.events.subscribe((val: NavigationEnd) => {
      if ( val.url) {
        if (val.url === '/account/user-tier/invitation') {
          this.activeTab = true;
        } else if (val.url === '/account/user-tier/my-tiers') {
          this.activeTab = true;
        } else if (val.url === '/account/user-tier/create') {
          this.activeTab = true;
        } else {
          this.activeTab = false;
        }
      }
    });
  }
  showNotification() {
    this.http.notification().subscribe(
      (arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].status !== 'read') {
            this.unreadMsg.push(arr[i].status);
          }
        }
      });
  }

  onClickLogin(val) {
    if (val) {
      const linkActive = this.dropdownlink.nativeElement.classList.contains('active-link');
      const dropdownActive = this.dropdown.nativeElement.classList.contains('show');
      if (linkActive && dropdownActive) {
        this.renderer.removeClass(this.dropdownlink.nativeElement, 'active-link');
        this.renderer.removeClass(this.dropdown.nativeElement, 'show');
        this.renderer.removeClass(this.drop.nativeElement, 'show');
        $('.val.dropdown-menu').dropdown('toggle');
      } else {
        this.renderer.addClass(this.dropdownlink.nativeElement, 'active-link');
        this.renderer.addClass(this.dropdown.nativeElement, 'show');
        $('.val.dropdown-menu').dropdown('toggle');
      }
    } else  {
      if (!this.auth.isAuthenticated()) {
        this.renderer.addClass(this.dropdownlink.nativeElement, 'active-link');
        this.renderer.addClass(this.dropdown.nativeElement, 'show');
      }
   }
  }

  ngDoCheck() {}

  ngAfterViewInit() {
    if (this.router.url === '/login') {
      this.onClickLogin(true);
    }
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.showNotification();
    }
    this.widthScreen = window.innerWidth;
    if (this.widthScreen < 991) {
      const menu = $('#menu');
      menu.addClass('navbar-dark');

    }
    // if (this.router.url === '/desktop' ) {
    //   if (window.innerWidth > 991) {
    //     const menu = $('#menu');
    //     menu.removeClass('gradient');
    //   }
    //   document.onscroll = (e) => {
    //     const menu = $('#menu');
    //     if (window.scrollY > 30) {
    //       menu.removeClass('navbar-dark');
    //       menu.removeClass('bg-dark');
    //       menu.addClass('gradient');
    //     } else {
    //       if(window.innerWidth > 991) {
    //         menu.removeClass('gradient');
    //         menu.addClass('navbar-dark');
    //         menu.addClass('bg-dark');
    //       }
    //     }
    //   };
    // }
    // if ((this.router.url === '/my-games') || (this.router.url === '/games') ) {
    //     if (window.scrollY >= 0) {
    //       const menu = $('#menu');
    //       console.log(menu);
    //       menu.addClass('gradient');
    //     }
    // }
    // console.log(window.scrollY);
        if (window.scrollY > 0) {
          const menu = $('#menu');
          // console.log(menu);
          menu.addClass('top');
        }
        document.onscroll = (e) => {
        const menu = $('#menu');
        if (window.scrollY > 10){
          menu.addClass('top');
        } else if (window.scrollY < 10) {
          menu.removeClass('top');
        }
        // console.log(window.scrollY);
        // if (window.scrollY > 30) {
        //   menu.removeClass('navbar-dark');
        //   menu.removeClass('bg-dark');
        //   menu.addClass('gradient');
        // } else {
        //   if(window.innerWidth > 991) {
        //     menu.removeClass('gradient');
        //     menu.addClass('navbar-dark');
        //     menu.addClass('bg-dark');
        //   }
        // }
      }
    this.subscriptionClick = this.auth.clickedBuyTicket
      .subscribe(
        () => {
          if (!this.logged) {
            $('.val.dropdown').dropdown('toggle');
            this.renderer.addClass(this.dropdownlink.nativeElement, 'active-link');
          }
        }
      );
      
  }


  login(values) {
    this.auth.login(values['email'], values['password'])
      .subscribe(
        data => {
          console.log(data);
          if (data.message == 'Authentication successful') {
            this.desk.getUserTiers();
          }
        },
        err => {
          console.log(err);
          this.notificationService.errorMsg(err + ' !', 'Error');
        },
        () => {
          this.router.navigateByUrl('/desktop', { skipLocationChange: true }).then(
            () =>
              this.router.navigate(['/desktop']));
              this.logged = true;
              this.auth.toggleLog.next(this.logged);
        }
      );
    this.renderer.removeClass(this.dropdown.nativeElement, 'show');
    this.form.nativeElement.reset();
  }

  ngOnDestroy() {
    this.subscriptionClick.unsubscribe();
  }
}
