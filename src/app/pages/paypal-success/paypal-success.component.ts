import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { BuyTier } from '../model/buytier.model';
@Component({
  selector: 'app-paypal-success',
  templateUrl: './paypal-success.component.html',
  styleUrls: ['./paypal-success.component.css']
})
export class PaypalSuccessComponent implements OnInit {

  public userId;
  public tierId;
  public allTiersId: any = [];

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthenticationService, private http: ApiService) {
      this.userId = this.auth.getUser();
     }

  ngOnInit() {
    this.betOfTier();
  }

  betOfTier() {
    const tier = new URL(location.href).searchParams.get('tierId');
    const ticket = new URL(location.href).searchParams.get('ticketId');
    localStorage.setItem('tier', tier);
    localStorage.setItem('ticket', ticket);
  }
  clearStorage() {
    localStorage.setItem('tier', 'null');
    localStorage.setItem('ticket', 'null');
  }
}
