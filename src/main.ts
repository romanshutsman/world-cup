import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { $ } from 'jquery';
declare const $;

if (environment.production) {
  enableProdMode();
}



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  setInterval(function() {
    const smallChat: HTMLElement = document.querySelector('#Smallchat');
    const log = localStorage.getItem('log');
    if (log == 'true') {
      smallChat.style.display = 'block';
    } else {
      smallChat.style.display = 'none';
    }
  }, 1500);



