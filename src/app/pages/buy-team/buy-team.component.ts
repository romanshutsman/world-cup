import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {ApiService} from '../../services/api/api.service';


@Component({
  selector: 'app-buy-team',
  templateUrl: './buy-team.component.html',
  styleUrls: ['./buy-team.component.css']
})
export class BuyTeamComponent implements OnInit {

  public action;
  private offerId: string;
  showLoader = false;
  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthenticationService, private http: ApiService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.action = params.action;
    });
  }

  onRoutPayPal() {
    this.showLoader = true;
    this.route.params.subscribe(params => {
      this.offerId = params.offerId;
      this.http.routeToPayPal(params.offerId)
        .subscribe(
          (response: any) => {
            window.location.href = response.redirectUrl;
          });
    })
  }

}
