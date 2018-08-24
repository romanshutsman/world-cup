import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {ApiService} from '../../services/api/api.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {


  constructor(
              private http: ApiService,
              private auth: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) {
  }
  ngOnInit() {
    const paypal_accept = new URL(location.href).searchParams.get('paypal_accept');
    const paypal_offer = new URL(location.href).searchParams.get('paypal_offer');
    if (paypal_accept) {
      if (paypal_accept === 'success') {
        this.notificationService.successMsg('Successful purchase!', 'Success');
      } else {
        this.notificationService.errorMsg('Something wrong!', 'Error');
      }
    }
    if (paypal_offer) {
      if (paypal_offer === 'success') {
        this.notificationService.successMsg('Successful created!', 'Success');
      } else {
        this.notificationService.errorMsg('Something wrong!', 'Error');
      }
    }
  }

}
