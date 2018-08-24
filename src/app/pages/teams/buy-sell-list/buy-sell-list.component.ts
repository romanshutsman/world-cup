import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {NgForm} from '@angular/forms';
import {NotificationService} from '../../../services/notification/notification.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-buy-sell-list',
  templateUrl: './buy-sell-list.component.html',
  styleUrls: ['./buy-sell-list.component.less']
})
export class BuySellListComponent implements OnInit {
  data: any = [];
  teamList: any = [];
  sellList: any = [];
  isLoadingOffer = false;
  isLoadingTeams = false;
  isLoadingSell = false;

  constructor(private http: ApiService,
              private router: Router,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getOffers();
    this.myTeamList();
    this.mySellList();
  }
  getOffers() {
    this.isLoadingOffer = true;
    this.http.getOffers()
      .subscribe(
        (offer: any) => {
          // for (let i = 0; i < offer.length; i++) {
          //   if (offer[i].status !== 'rejected') {
          //     this.data.push(offer[i]);
          //   }
          // }
          this.data = offer;
          console.log(this.data);
          console.log(offer);
          this.isLoadingOffer = false;
        }
      );
  }

  myTeamList() {
    this.isLoadingTeams = true;
    this.http.myTeamList()
      .subscribe(
        (list) => {
          this.teamList = list;
          console.log(list);
          this.isLoadingTeams = false;
        }
      );
  }

  mySellList() {
    this.isLoadingSell = true;
    this.http.mySellList()
      .subscribe(
        (list) => {
          this.sellList = list;
          console.log(this.sellList);
          this.isLoadingSell = false;
        }
      );
  }

  onSend(form: NgForm, offerId, ofa) {

    const values = form.form.value;
    if (values.sellect === 'Accept') {
      // this.router.navigate(['/accept-offer', offerId]);
      this.http.teamAccept(offerId)
      .subscribe(
        (resp: any) => {
          console.log(resp);
          this.notificationService.successMsg(resp.message, 'Success!');
          this.getOffers();
        } ,
        (error) => {
          this.notificationService.errorMsg(error.error.message, 'Error');
        });
    } else if (values.sellect === 'Reject') {
      this.http.teamReject(offerId).subscribe(
        (data) => {
          console.log(data);
          this.notificationService.successMsg('You have rejected offer!', 'Success');
          this.getOffers();
        },
        (error) => {
          console.log(error);
          this.notificationService.errorMsg(error.error.message, 'Error');
        }
      );
    }
  }

}
