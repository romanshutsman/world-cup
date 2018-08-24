import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, NgForm, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../../services/auth/authentication.service';
import {ApiService} from '../../../services/api/api.service';
import {NotificationService} from '../../../services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from './../../../services/data/data.service';

@Component({
  selector: 'app-user-tier',
  templateUrl: './user-tier.component.html',
  styleUrls: ['./user-tier.component.scss']
})

export class UserTierComponent implements OnInit {
  @ViewChild('inputTag') inputTag: ElementRef;
  inputTagHeight: number;

  public email: string;
  public name: string;
  public userId: string;
  public editForm: FormGroup;
  public password: AbstractControl;
  public passwordNew: AbstractControl;
  public passwordRepeat: AbstractControl;
  public emails: any = [];
  public inviteMore: any = [];
  public validators = [this.validateEmail];
  public tierIdInvite: any;
  public isLoading = false;
  public getInvent: any = [];
  public toggleResend = false;
  public unreadTiers = [];
  public unreadInvitation = [];
  public errorMessages = {
    'email': 'Please enter a valid email !'
  };
  myTiers: any = [];

  stages ;



  constructor(public auth: AuthenticationService,
              public router: Router,
              private myHttp: ApiService,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              private route: ActivatedRoute,
              private data: DataService
              ) {
                this.stages = this.data.stages;
    if (auth.isAuthenticated() && auth.getUser().verify) {
      this.email = auth.getUser().email;
      this.userId = auth.getUser().userId;
      this.name = JSON.parse(localStorage.getItem('user')).name;
    } else if (auth.isAuthenticated() && !auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    } else {
      this.router.navigate(['/login']);
    }
    this.editForm = fb.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8),
        Validators.maxLength(16)])],
      'passwordNew': ['', Validators.compose([Validators.required, Validators.minLength(8),
        Validators.maxLength(16)])],
      'passwordRepeat': ['', Validators.compose([Validators.required, Validators.minLength(8),
        Validators.maxLength(16)])]
    });
    this.password = this.editForm.controls['password'];
    this.passwordNew = this.editForm.controls['passwordNew'];
    this.passwordRepeat = this.editForm.controls['passwordRepeat'];
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
              this.unreadInvitation.push(arr[i].type);
            }
            if (arr[i].type === 'info') {
              this.unreadTiers.push(arr[i].type);
            }
          }
        }
      });
  }


  private validateEmail(control: AbstractControl): ValidationErrors | null {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(control.value) ? null : {'email': true};
  }


  createTier(form: NgForm) {
    const values = form.form.value;
    const emails = [];
    if (values.items) {
      for (const email of values.items) {
        emails.push(email.value);
      }
    }
    const name = values.tierName;
    const price = values.price;
    const prize = values.prize;
    const stage = values.stage;

    const data = {
      name: name,
      price: price,
      prize: prize,
      stage: stage,
      owner: this.email,
      invitations: emails
    };
    console.log(data);
    this.myHttp.createUserTier(data)
      .subscribe(
        () => {
          this.notificationService.successMsg('Tier created !', 'Success');
        },
        (error) => {
          console.log(error);
          this.notificationService.errorMsg('Invited emails is not valid !', 'Error');
        }
      );
    form.reset();
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
  getInvitation() {
    this.myHttp.getInvitation()
      .subscribe(
        (tiers) => {
          this.getInvent = tiers;
        },
        (error) => {

        }
      );
  }



}
