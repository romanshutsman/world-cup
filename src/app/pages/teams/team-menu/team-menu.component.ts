import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, NgForm, ValidationErrors, FormControl } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ApiService} from '../../../services/api/api.service';
import {NotificationService} from '../../../services/notification/notification.service';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import { FormControlName } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { DataService } from './../../../services/data/data.service';

@Component({
  selector: 'app-team-menu',
  templateUrl: './team-menu.component.html',
  styleUrls: ['./team-menu.component.less']
})
export class TeamMenuComponent implements OnInit {
  public email: string;
  public errorMessage;
  public offerbuy: FormGroup;
  public offersell: FormGroup;


  




  teams = this.data.teams;
  constructor(private http: ApiService,
              private notificationService: NotificationService,
              public auth: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              fb: FormBuilder,
              private data: DataService) {
    this.email = auth.getUser().email;
    this.offerbuy = fb.group({
      'count': ['', Validators.compose([Validators.pattern('[0-9]{1,20}'), Validators.required, Validators.minLength(1)])],
      'price': ['', Validators.compose([Validators.pattern('[0-9]{1,20}'), Validators.required, Validators.minLength(1)])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')])],
       'team': ['', Validators.compose([Validators.required])] 
      });
    this.offersell = fb.group({
      'count': ['', Validators.compose([Validators.pattern('[0-9]{1,20}'), Validators.required, Validators.minLength(1)])],
      'price': ['', Validators.compose([Validators.pattern('[0-9]{1,20}'), Validators.required, Validators.minLength(1)])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')])],
       'team': ['', Validators.compose([Validators.required])] 
      });

  }

  ngOnInit() {
  }

  createSellOffer(form: NgForm) {
    const values = form.value;
    const team = values.team;
    const price = values.price;
    const quantity = values.count;
    const email = values.email;


    const data = {
      team: team,
      quantity: quantity,
      price: price,
      offerTo: email,
      offerFrom: this.email,
      action: 'sell'

    };
    this.http.createOffer(data)
      .subscribe(
        (response: any) => {
          // this.router.navigate(['/buy-team', data.action, response.offerId]);
          this.notificationService.successMsg(response.message, 'Success!');
        },
        (error) => {
          this.errorMessage = error;
          this.notificationService.errorMsg(error.error.message, 'Error');
        }
      );
    form.reset();
  }

  createBuyOffer(form: NgForm, offer: NgForm) {


    const values = form.value;
    const team = values.team;
    const price = values.price;
    const quantity = values.count;
    const email = values.email;

    const data = {
      team: team,
      quantity: quantity,
      price: price,
      offerTo: email,
      offerFrom: this.email,
      action: 'buy'

    };
    console.log(data);
    this.http.createOffer(data)
      .subscribe(
        (response: any) => {
          console.log(response);
          // this.router.navigate(['/buy-team', data.action, response.offerId]);
          this.notificationService.successMsg(response.message, 'Success!');
        },
        (error) => {
          console.log(error.error.message);
          this.notificationService.errorMsg(error.error.message, 'Error');
        }
      );
    form.reset();
  }


}


