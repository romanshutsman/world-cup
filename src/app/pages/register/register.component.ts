import { Component, OnInit } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public passwords: FormGroup;
  public email: AbstractControl;
  public name: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public accept: AbstractControl;
  public errorMessage;

  constructor(fb: FormBuilder, private auth: AuthenticationService, private router: Router) {
    this.registerForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(
        '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
      )])],
      'name': ['', Validators.compose([
          Validators.required,
        Validators.pattern('^[A-Za-z0-9_.-]{2,20}$')])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(16)])]
      }, {validator: this.validate('password', 'repeatPassword')})
    });

    this.email = this.registerForm.controls['email'];
    this.name = this.registerForm.controls['name'];
    this.passwords = <FormGroup> this.registerForm.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  register(values) {
    console.log(values);
    this.auth.register(values['email'], values['name'], values['passwords']['password'])
      .subscribe(
        data => {
          console.log(data);
          this.auth.login(values['email'], values['passwords']['password'])
            .subscribe(() => {
              this.router.navigate(['/confirm-email']);
            });
        },
        err => {
          console.log(err);
          this.errorMessage = err;
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

  ngOnInit() {
  }

}
