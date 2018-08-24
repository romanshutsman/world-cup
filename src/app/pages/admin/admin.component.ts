import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api/api.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  createTierForm: FormGroup;

  constructor(public auth: AuthenticationService,
              public router: Router,
              private http: ApiService,
              private notificationService: NotificationService) {
    if (this.auth.isAuthenticated()) {
      if (!this.auth.getUser().admin) {
        this.router.navigateByUrl('/404', { skipLocationChange: true });
      }
    }
  }

  ngOnInit() {
    this.createTierForm = new FormGroup({
      'price' : new FormControl(null),
      'prize' : new FormControl(null)
    });
  }

  onSubmit() {
    console.log(this.createTierForm.value);
    this.http.addTier(this.createTierForm.value)
      .subscribe(
        () => {
          this.notificationService.successMsg('Tier created !', 'Success');
        }
      );
    this.createTierForm.reset();
  }
}


