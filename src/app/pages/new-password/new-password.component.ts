import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/auth/authentication.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public passwords: FormGroup;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public errorMessage;
  private token;

  constructor(fb: FormBuilder, private auth: AuthenticationService, private router: Router, private route: ActivatedRoute) {

    this.token = this.route.snapshot.paramMap.get('token');

    this.resetPasswordForm = fb.group({
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])]
      }, {validator: this.validate('password', 'repeatPassword')})
    });
    this.passwords = <FormGroup> this.resetPasswordForm.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  ngOnInit() {

  }

  resetPassword(values) {
    console.log(values);
    this.auth.resetPassword(this.token, values['passwords']['password'])
      .subscribe(
        data => console.log(data),
        err => {
          console.log(err);
          this.errorMessage = err;
        },
        () => {
          this.router.navigate(['/login']);
        }
      );
  }

  validate(firstField, secondField) {

    return (c: FormGroup) => {

      return (c.controls && c.controls[firstField].value === c.controls[secondField].value) ? null : {
        passwordsEqual: {
          valid: false
        }
      };
    };
  }
}
