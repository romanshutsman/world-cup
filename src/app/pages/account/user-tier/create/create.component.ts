import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, NgForm, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthenticationService} from '../../../../services/auth/authentication.service';
import {ApiService} from '../../../../services/api/api.service';
import {NotificationService} from '../../../../services/notification/notification.service';
import {injectViewContainerRef} from '@angular/core/src/render3/instructions';
import { trigger, style, animate, transition } from '@angular/animations';
import {DataService} from '../../../../services/data/data.service';

@Component({
  selector: 'app-create',
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
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

export class CreateComponent implements OnInit {
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
  public toggleResend = false;
  public tierStages = [];
  public errorMessages = {
    'email': 'Please enter a valid email !'
  };
  myTiers: any = [];
  matchEmail = false;
  errorEmail = true;

  stages;
  public forPrice: FormGroup;

  constructor(public auth: AuthenticationService,
              public router: Router,
              private myHttp: ApiService,
              private fb: FormBuilder,
              private notificationService: NotificationService,
              private data: DataService
            ) {
              this.stages = this.data.stages2;
    if (auth.isAuthenticated() && auth.getUser().verify) {
      this.email = auth.getUser().email;
      this.userId = auth.getUser().userId;
      this.name = JSON.parse(localStorage.getItem('user')).name;
    } else if (auth.isAuthenticated() && !auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    } else {
      this.router.navigate(['/login']);
    }
    this.forPrice = fb.group({
      'name': ['', ''],
      'stage': ['', ''],
      'emails': ['', '']
    });
  }

  ngOnInit() {
    this.firstTime = JSON.parse(localStorage.getItem('tog'));
    if (this.firstTime) {
      // this.redirectFromMyScores();
    }
  }
  
  private validateEmail(control: AbstractControl): ValidationErrors | null {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(control.value) ? null : {'email': true};
  }



  createTier(form: NgForm) {
    console.log(form);
    console.log(form.form.value);
    const values = form.form.value;
    const emails = [];
    if (values.emails) {
      for (const email of values.emails) {
        emails.push(email.value);
      }
    }
    const name = values.name;
    const price = values.price;

    const data = {
      name: name,
      owner: this.email,
      invitations: emails
    };
    console.log(data);
    this.myHttp.createUserTier(data)
      .subscribe(
        () => {
          const lang = localStorage.getItem('lang');
          let msg: string;
          if (lang == 'pt') {
            msg = 'Bolão autorizado com sucesso. Acesse através da página inicial!';
          } else {
            msg = 'Tier created successfully. Please, check home page!';
          }
          this.notificationService.confirm(msg, 'Success');
          form.reset();
          this.stages.forEach(function (item) {
            item.checked = false;
          });
        },
        (error) => {
          console.log(error);
          // this.notificationService.errorMsg('Invited emails is not valid !', 'Error');
          this.notificationService.errorMsg(error.error.message, 'Error');
        }
      );
  }
  Space(e) {
    if (e.keyCode == 32) {
      return false;
    }
    if (e.keyCode == 13 || e.keyCode == 32) {
      if (this.matchEmail) {
        // return false;
      }
    }
  }
  SpacePress(e) {
    if (e.keyCode == 13 || e.keyCode == 32) {
      if (!this.errorEmail) {
        return false;
      }
    }
  }
  tChange(e) {
    if (e.target.value != '') {
      this.errorEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(e.target.value);
      if (this.errorEmail) {
        if (this.email == e.target.value) {
          this.errorEmail = false;
        } else {
          this. errorEmail = true;
        }
      }
    } else {
      this. errorEmail = true;
    }

    let match;
      this.myTiers.forEach(el => {
          let res =  el.invitations.forEach(element => {
            if (e.target.value === element.to) {
              match = (e.target.value === element.to);
              return true;
            }
          });
          return match;
        });
    this.matchEmail = match;
    return match;

  }


}
