import { Injectable } from '@angular/core';
import { SnotifyPosition, SnotifyService } from 'ng-snotify';

@Injectable()
export class NotificationService {

  constructor(private snotifyService: SnotifyService) { }

  successMsg(body: string, title: string) {
    this.snotifyService.success(body, title, {
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      position: SnotifyPosition.rightBottom
    });
  }

  errorMsg(body: string, title: string) {
    this.snotifyService.error(body, title, {
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      position: SnotifyPosition.rightBottom
    });
  }
  warn(body: string, title: string) {
    this.snotifyService.warning(body, title, {
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      position: SnotifyPosition.rightBottom
    });
  }
  confirm(body: string, title: string) {
    this.snotifyService.confirm(body, title, {
      showProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      position: SnotifyPosition.centerTop
    });
  }
}
