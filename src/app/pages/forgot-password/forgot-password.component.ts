import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public errorMessage;
  public message;
  public forgotPasswordForm: FormGroup;
  public email: AbstractControl;

  constructor(private auth: AuthenticationService, private router: Router, fb: FormBuilder) {
    this.forgotPasswordForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(
        '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-' +
        'z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
      )])]
    });
    this.email = this.forgotPasswordForm.controls['email'];
  }

  ngOnInit() {
  }

  goToDesk() {
    this.router.navigate(['/desktop']);
  }

  forgotPassword(values) {
    console.log(values);
    this.auth.forgotPassword(values['email'])
      .subscribe(
        data => {
          console.log(data);
          this.message = data.message;
        },
        err => {
          console.log(err);
          this.errorMessage = err;
        }
      );
  }
}
