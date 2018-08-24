import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import {HeaderNotificationComponent} from './pages/header-notification/header-notification.component';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {AuthenticationService} from './services/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {
  public data;
  lang: any;
  subscriptionLang: Subscription;


  constructor (private translate: TranslateService, private header: HeaderNotificationComponent, private auth: AuthenticationService) {
    
    translate.addLangs(['en', 'pt']);
    // translate.setDefaultLang('en');

    let browserLang = translate.getBrowserLang();
        // translate.use(browserLang.match(/en|pt/) ? browserLang : 'en');

    this.subscriptionLang = this.auth.chooseLang
    .subscribe(
      (lang) => {
        localStorage.setItem('lang', lang);
        let language = localStorage.getItem('lang');
        translate.use(language);
      }
    );
  }

}


