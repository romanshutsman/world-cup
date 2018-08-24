import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(private auth: AuthenticationService, private api: ApiService, private router: Router) {
    if (!auth.isAuthenticated() || auth.getUser().verify) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
  }

  sendEmail() {
    this.api.resendConfirmEmail(this.auth.getUser().userId).subscribe(
      (data: any) => {
        alert(data.message);
      },
      err => {
        console.log(err);
      }
     );
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/desktop']);
  }

}
