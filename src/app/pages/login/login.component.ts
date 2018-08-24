import { Component, OnInit } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { AuthenticationService } from '../../services/auth/authentication.service';
import {Router} from '@angular/router';
import { Routes } from "@angular/router";
import { RouterLinkActive } from '@angular/router';
import { RegisterComponent } from "../register/register.component";
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public errorMessage;
  public loginForm: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;

  constructor(private auth: AuthenticationService, private router: Router, fb: FormBuilder) {
    if (auth.isAuthenticated()) {
      this.router.navigate(['/desktop']);
    }
    this.loginForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(
        '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
      )])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])]
    });
    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
  }

  ngOnInit() {
  }

  login(values) {
    console.log(values);
    this.auth.login(values['email'], values['password'])
      .subscribe(
        data => console.log(data),
        err => {
        console.log(err);
        this.errorMessage = err;
        },
        () => {
          this.router.navigate(['/desktop']);
        }
      );
  }

}
