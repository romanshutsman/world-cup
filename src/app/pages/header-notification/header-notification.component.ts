import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {$} from 'jquery';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {ElementRef} from '@angular/core/src/linker/element_ref';
import {ApiService} from '../../services/api/api.service';
import 'rxjs/Rx';
import {Location} from '@angular/common';
import {Subject} from 'rxjs/Subject';
import { DataService } from './../../services/data/data.service';
declare var $: any;

@Component({
  selector: 'app-header-notification',
  templateUrl: './header-notification.component.html',
  styleUrls: ['./header-notification.component.css']
})

export class HeaderNotificationComponent implements OnInit {
  public language;
  public selectedLang;
  public toggleLog;
  public staticToggle;
  public notif: any = [];
  public test: any = [];
  public counter: number = 0;
  public countBell: number ;
  public evTog = true;
  public isColor = false;
  public notId: any;


  public lang = new Subject<any>();


  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private http: ApiService,
    private loc: Location,
    private data: DataService) {
    this.language = this.data.language;
  }

  disabledButton() {
    const check = <HTMLInputElement> document.querySelector('.toggleUser');
    const checkSpan = document.querySelector('.slider');
    const notification = <HTMLInputElement> document.querySelector('.notification');
    const notif_count = document.querySelector('.notification-counter');
    if (this.auth.isAuthenticated() || this.toggleLog) {
      if (check) {
        checkSpan.classList.remove('slider-disable');
        check.disabled = false;
        notification.disabled = false;
        (notif_count as HTMLElement).style.display = 'flex';
        const getTog = JSON.parse(localStorage.getItem('tog'));
        this.toggle(getTog, '');
      }
    } else {
      checkSpan.classList.add('slider-disable');
      check.disabled = true;
      notification.disabled = true;
      (notif_count as HTMLElement).style.display = 'none';
      this.staticToggle = false;
    }
  }

  ngOnInit() {
    this.auth.toggleLog.subscribe(
      (val) => {
        this.toggleLog = val;
        // this.http.toggleTiers = val;
        this.disabledButton();
      }
    );
    
    this.disabledButton();
    let language = localStorage.getItem('lang');
    if (language) {
      this.changeLeanguage(language);
    } else {
      this.changeLeanguage('pt');
    }
    if (this.auth.isAuthenticated()) {
      const getTog = JSON.parse(localStorage.getItem('tog'));
      this.toggle(getTog, '');

      this.http.notification().subscribe(
        (arr: any) => {
          this.notif = arr;
        });
      this.showNotification();
    }
  }

  switchTog() {
    const inp = <HTMLInputElement> document.querySelector('.toggleUser');
    inp.checked = true;
    this.staticToggle = true;
  }

  toggle(tog, evTog) {
    const sl = document.querySelector('.slider');
    let location = window.location.pathname;
    $(sl).click(
      function () {
        sl.classList.add('anim');
      }
    );
    localStorage.setItem('tog', tog);
    const getTog = JSON.parse(localStorage.getItem('tog'));
    this.staticToggle = getTog;
    tog = true;
    this.auth.toggleUsersTiers.next(tog);
    this.http.toggleSwitch.next(tog);
    if (location === '/games') {
      if (evTog === true) {
        sl.classList.add('anim');
        this.router.navigate(['/user']);
      }
    }
    if (location === '/rankings') {
      if (evTog === true) {
        this.router.navigate(['/user']);
      }
    }
    if (location === '/my-games') {
      if (evTog === true) {
        this.router.navigate(['/user']);
      }
    }
  }

  dropSelect() {
    $('.dropdown-menu li a').click(function () {
      let selText = $(this).text();
      $(this).parents('.btn-group').find('.dropdown-toggle.select').html(selText + ' <span class="caret"></span>');
    });
  }

  changeLeanguage(lang) {
    this.auth.chooseLang.next(lang);
    if ( lang === 'en') {
      this.selectedLang =
      {
        src: '../../../assets/images/gb.svg',
        lang: 'ENG',
        code: 'en'
      };
    } else {
      this.selectedLang =
      {
        src: '../../../assets/images/br.svg',
        lang: 'BRA',
        code: 'pt'
      };
    }
    return lang;
  }


  showNotification() {
    if (this.auth.isAuthenticated()) {
      this.http.notification().subscribe(
        (arr: any) => {
          this.notif = arr.reverse();
          this.test = [];
          for (let i = 0; i < this.notif.length; i++) {
            if (arr[i].status !== 'read') {
              this.test.push(arr[i].status)
              this.counter = this.test.length;
            }
          }
          if (this.countBell === 0) {
            this.counter = 0;
          }
        });
    }
  }

  routeTo(type) {
    for (let i = 0; i < this.notif.length; i++) {
      if (type === 'invitation') {
        this.router.navigate(['/account/user-tier/invitation']);
      }
      if (type === 'info') {
        this.router.navigate(['/account/user-tier/my-tiers']);
      }
      if (type === 'offer') {
        this.router.navigate(['/teams']);
      }
    }
  }

  readAll() {
    this.counter = 0;
    this.http.readAll().subscribe(
      data => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  readOne(notificationId, n) {
    this.notId = notificationId;
    if (n.status == 'unread') {
      this.http.readOne(notificationId).subscribe();
      if (this.auth.isAuthenticated()) {
        this.showNotification();
      }
      for (let i = 0; i < this.notif.length; i++) {
        if (this.notif[i]._id === notificationId) {
          this.isColor = true;
        }
      }
      if (this.counter === 1) {
        this.countBell = 0;
      }
    }
  }

}

