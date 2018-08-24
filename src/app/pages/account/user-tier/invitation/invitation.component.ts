import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../../../services/auth/authentication.service';
import {ApiService} from '../../../../services/api/api.service';
import {NotificationService} from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})

export class InvitationComponent implements OnInit {
  @ViewChild('inputTag') inputTag: ElementRef;

  public email: string;
  public name: string;
  public userId: string;
  public emails: any = [];
  public isLoadingInvite = false;
  public getInvent: any = [];
  myTiers: any = [];


  constructor(public auth: AuthenticationService,
              public router: Router,
              private myHttp: ApiService,
              private fb: FormBuilder,
              private notificationService: NotificationService) {
    if (auth.isAuthenticated() && auth.getUser().verify) {
      this.email = auth.getUser().email;
      this.userId = auth.getUser().userId;
      this.name = JSON.parse(localStorage.getItem('user')).name;
    } else if (auth.isAuthenticated() && !auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.getInvitation();
  }


  getInvitation() {
    this.isLoadingInvite = true;
    this.myHttp.getInvitation()
      .subscribe(
        (tiers) => {
          this.getInvent = tiers;
          this.isLoadingInvite = false;
        },
        (error) => {

        }
      );
  }


  acceptTierInvitation(inviteId) {
    console.log(inviteId);
    this.myHttp.acceptTierInvitation(inviteId)
      .subscribe(
        (tiers) => {
          this.getInvitation();
          this.notificationService.successMsg('Invitation accepted !', 'Success');
        },
        (error) => {
          this.notificationService.errorMsg('Error!', 'Error');
        }
      );
  }

  rejectTierInvitation(inviteId) {
    console.log(inviteId);
    this.myHttp.rejectTierInvitation(inviteId)
      .subscribe(
        (tiers) => {
          console.log(tiers);
          this.getInvitation();
          this.notificationService.warn('Invitation rejected !', 'Tier rejected');
        },
        (error) => {
          this.notificationService.errorMsg('Error!', 'Error');
        }
      );
  }

}
