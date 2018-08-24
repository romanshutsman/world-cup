import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {ApiService} from '../../services/api/api.service';


@Component({
  selector: 'app-accept-offer',
  templateUrl: './accept-offer.component.html',
  styleUrls: ['./accept-offer.component.css']
})
export class AcceptOfferComponent implements OnInit  {

  private offerId: string;
  showLoader = false;
  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthenticationService, private http: ApiService) {
  }

  ngOnInit() {

  }

  onRoutPayPal() {
    this.showLoader = true;
    this.route.params.subscribe(params => {
      console.log(params);
      this.offerId = params.offerId;
      this.http.teamAccept(params.offerId)
        .subscribe(
          (response: any) => {
            console.log(response);
            window.location.href = response.redirectUrl;
          });
    });
  }

}
