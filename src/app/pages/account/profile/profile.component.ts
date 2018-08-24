import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, NgForm, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../../services/auth/authentication.service';
import {ApiService} from '../../../services/api/api.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {injectViewContainerRef} from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})

export class ProfileComponent implements OnInit {
  @ViewChild('inputTag') inputTag: ElementRef;

  public email: string;
  public name: string;
  public userId: string;
  public editForm: FormGroup;
  public password: AbstractControl;
  public passwordNew: AbstractControl;
  public passwordRepeat: AbstractControl;
  public pass1: any;
  public pass2: any;
  public emails: any = [];
  public firstTime;
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
    this.firstTime = JSON.parse(localStorage.getItem('tog'));
  }
  changePassword() {
    const data = {
      email: this.email,
      password: this.password.value,
      newPassword: this.passwordRepeat.value
    };
    this.myHttp.changePassword(data)
      .subscribe(
        () => {
          this.notificationService.successMsg('Password changed !', 'Success');
        },
        () => {
          this.notificationService.errorMsg('Password incorrect !', 'Error');
        });
    this.editForm.reset();
  }
}
