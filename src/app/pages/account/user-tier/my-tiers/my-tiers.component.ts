import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder,  ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../../../services/auth/authentication.service';
import {ApiService} from '../../../../services/api/api.service';
import {NotificationService} from '../../../../services/notification/notification.service';
import { trigger, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-my-tiers',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    ),
  ],
  templateUrl: './my-tiers.component.html',
  styleUrls: ['./my-tiers.component.scss']
})

export class MyTiersComponent implements OnInit {
  @ViewChild('inputTag') inputTag: ElementRef;
  inputTagHeight: number;

  public email: string;
  public name: string;
  public userId: string;
  public emails: any = [];
  public inviteMore: any = [];
  public validators = [this.validateEmail];
  public firstTime;
  public tierIdInvite: any;
  public isLoading = false;
  public toggleResend = false;
  myTiers: any = [];

  matchEmail = false;
  key = true;
  tierID;
  disableButton = false;
  errorEmail = true;
  showEdit: any;
  readonly = true;


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
    this.getUserTiers();
    this.firstTime = JSON.parse(localStorage.getItem('tog'));
  }
  edit(tier) {
    this.readonly = false;
  }
  save(tier, editTier) {
    const newNameTier = editTier.viewModel;
    this.readonly = true;
    const body = {
      name: editTier.viewModel
    };
    this.myHttp.updateTierName(tier._id, body)
      .subscribe(
        (response) => {
          this.notificationService.successMsg(response['message'], 'Success');
          this.getUserTiers();
        },
        (error) => {
          this.disableButton = false;
          this.notificationService.errorMsg('Something wrong! Try again!', 'Error');
        }
      );
  }
  delete(tier) {
    if (confirm('You also remove this tier from users who was buy it with all bets. Restore it will be impossible.')){
      this.myHttp.deleteTier(tier._id)
      .subscribe(
        (response) => {
          this.notificationService.successMsg(response['message'], 'Success');
          this.getUserTiers();
        },
        (error) => {
          this.disableButton = false;
          this.notificationService.errorMsg('Something wrong! Try again!', 'Error');
        }
      );
    } else {
      this.notificationService.errorMsg('Something wrong! Try again!', 'Error');
    }
  }


  addMoreFriends(input, tier, inputTag, user) {
    console.log(user);
    this.inviteMore = [];
    const invitations: any = [];
    if (Array.isArray(input)) {
      input.forEach(element => {
        invitations.push(element.value);
      });
    } else {
      console.log(user._id);
      console.log(tier['invitations']);
      invitations.push(input);
      this.toggleResend = true;
    }
    console.log(invitations);

    // this.tierIdInvite = tier['invitations'][0].tier;
    this.tierIdInvite = tier._id;
    if (this.auth.isAuthenticated()) {
      const body = {
        invitations: invitations,
        tierId: this.tierIdInvite
      };

      this.sendInvitation(body, input);
    }
  }

  sendInvitation(body, input) {
    this.myHttp.sendInvitation(body)
      .subscribe(
        (tiers) => {
          this.notificationService.successMsg('Invitation sent !', 'Success');
          input = [];
          this.getUserTiers();
        },
        (error) => {
          this.disableButton = false;
          this.notificationService.errorMsg('Invited emails is not valid !', 'Error');
        }
      );
  }


  resendInvitaion(invite, tier) {
    this.myHttp.resendUserTierInvitation(invite._id)
      .subscribe(
        (tiers) => {
          this.notificationService.successMsg('Invitation resent successfully!', 'Success');
        },
        (error) => {
          this.notificationService.errorMsg('Error!', 'Error');
        }
      );
  }

  private validateEmail(control: AbstractControl): ValidationErrors | null {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(control.value) ? null : {'email': true};
  }
  checkEmail() {

  }
  invite(i, tier) {
    this.disableButton = false;
    if (Array.isArray(i)) {
      if (i.length == 0) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
    }
    this.myTiers.forEach(el => {
      if (tier._id == el._id) {
        this.tierID = el._id;
      }
    });
  }

  checkHight() {
    this.inputTagHeight = this.inputTag.nativeElement.offsetHeight;
  }

  Space(e) {
    if (e.keyCode == 32) {
      return false;
    }
    if (e.keyCode == 13 || e.keyCode == 32) {
      if (this.matchEmail) {
        this.key = false;
        return false;
      }
    }
  }
  tChange(e, tier) {
    if (e.target.value != '') {
      this.errorEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(e.target.value);
    } else {
      this. errorEmail = true;
    }

    let match;
      this.myTiers.forEach(el => {
        if (tier._id == el._id) {
          this.tierID = el._id;
          let res =  el.invitations.forEach(element => {
            if (e.target.value === element.to) {
              match = (e.target.value === element.to);
              return true;
            }
          });
          return match;
        }
        });
    this.matchEmail = match;
    return match;

  }

  getUserTiers() {
    this.isLoading = true;
    this.myHttp.getUserTiers(this.userId)
      .subscribe(
        (tiers) => {
          this.myTiers = tiers;

          this.isLoading = false;
        }
      );
  }


  dropDown(tier) {
    this.showEdit = tier._id;
    tier.activate = !tier.activate;
    this.inputTagHeight = this.inputTag.nativeElement.offsetHeight;
    // console.log(this.inputTagHeight);
  }

}
