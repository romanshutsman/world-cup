import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BuyTier } from '../model/buytier.model';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  private tierId: string;
  private userTierId: string;
  public price: number;
  public prize: number;
  subscriptionToggle: Subscription;
  togTier;
  showLoader = false;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthenticationService, private http: ApiService) {
  }

  ngOnInit() {
    this.subscriptionToggle = this.auth.toggleUsersTiers
    .subscribe(
      (val) => {
        this.togTier = val;
      }
    );
    setTimeout(() => {
      if (this.togTier) {
        this.route.params.subscribe(params => {
          console.log(params);
          if (params.tierId) {
            this.userTierId = params.tierId;
            this.http.getUserTierById(this.userTierId)
              .subscribe(
                (data: any) => {
                  this.price = data.price;
                }, error => {
                  this.router.navigate(['/desktop']);
            });
          }
        });
      } else  {
          this.route.params.subscribe(params => {
            if (params.tierId) {
             this.tierId = params.tierId;
             this.http.getTierById(this.tierId)
               .subscribe(
                 (data: any) => {
                  console.log(data);
                   this.price = data.tiers.price;
                 }, error => {
                    this.router.navigate(['/desktop']);
              });
            }
          });
      }
    }, 0);
  }

  buyTicket() {
    this.showLoader = true;
    if (this.auth.isAuthenticated()) {
      const user = this.auth.getUser();
      const body: BuyTier = {
        userId: user.userId,
        tierId: this.tierId
      };
      this.http.buyTier(body).subscribe(
        (data: any) => {
          window.location.href = data.redirectUrl;
        }, error => {
        });
    } else {
      alert('Please log in !');
      this.router.navigate(['/login']);
    }
  }

  buyUserTicket() {
    this.showLoader = true;
    if (this.auth.isAuthenticated()) {
      const user = this.auth.getUser();
      const body: BuyTier = {
        userId: user.userId,
        tierId: this.userTierId
      };
      this.http.buyUserTicket(body).subscribe(
        (data: any) => {
          window.location.href = data.redirectUrl;
        }, error => {
        });
    } else {
      alert('Please log in !');
      this.router.navigate(['/login']);
    }
  }

}
