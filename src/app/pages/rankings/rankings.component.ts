import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { $ } from 'jquery';
declare const $;

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit  {

  authenticated: boolean;
  admin: boolean;
  public allTiers = new Array();
  public isloading = true;
  public isLoadingGroup = true;
  public sortTier;
  public selectedTier;
  public userId: any;
  public bets: any = [];
  public tiers: any = [];
  public tierId;
  public redirect = false;
  public edit: any = [];
  public groups;
  public user;
  public toggle = false;
  public show = true;
  public user_storage;
  public rankings: any = [];
  public rank_tickets: any = [];
  public user_info: any = [];
  public ticketsLenght;
  subscriptionToggle: Subscription;
  public togBtn;
  public addClass = false;
  public userClass;
  public timeRank;
  public toggleArr;
  public showArrow: any ;

  constructor(private http: ApiService, private auth: AuthenticationService, private router: Router) {
    this.authenticated = this.auth.isAuthenticated();
    this.userId = this.auth.getUser();
    if (this.authenticated) {
      this.admin = this.auth.getUser().admin;
    }
  }

  showTicket() {
    setTimeout(() => {
      if (document.querySelector('.anchor')) {
        document.querySelector('.anchor').scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
    // if (window.innerHeight > 800 )  {
    //   setTimeout(() => {
    //     window.scrollTo(0, 0);
    //   }, 1000);
    // }
  }

  showBlock(name) {
    if (name.name === this.user) {

      this.toggle = !this.toggle;
    }
  }
  toggleArrow(item) {
    // console.log(item, 'CLICK');
    this.rankings.forEach(element => {
      if (item == element) {
        this.toggleArr = element;
        // console.log(element, 'FOR');
      }
    });
  }

  showTier(tierShow) {
    this.user_info = [];
    this.rankings = [];
    this.show = false;
    this.isLoadingGroup = true;
    this.selectedTier = tierShow;
    console.log(this.tiers);
    this.http.rankingsPage(tierShow).subscribe( (rank: {
      rankings : any,
      updatedAt: any
    })  => {
      console.log(rank);
      
      if (rank.updatedAt) {
        this.timeRank = rank.updatedAt;
      } else {
        this.timeRank = new Date().toISOString();
      }
      this.isloading = false;
      this.isLoadingGroup = false;
      if (rank.rankings.length > 0) {
        this.rankings = rank.rankings;
        this.rankings = rank.rankings.sort((a, b) => {
          return b.points - a.points;
        });
        console.log(this.rankings);
      }
      this.user_storage = JSON.parse(localStorage.getItem('user'));
      this.rankings.forEach((element, i) => {
        const data = element;
        data.position = i + 1 ;
        if (element.user.name === this.user_storage.name) {
          if (element.tickets) {
            this.showArrow = 1;
          } else {
            this.showArrow = 0;
          }
          this.addClass = true;
          this.rank_tickets = [];
          if (element.tickets) {
 
            element.tickets.forEach((el) => {
              this.rank_tickets.push({'points' : el.points});
            });
            if (this.rank_tickets[9]) {
              this.rank_tickets[9].id = 'last';
            }
            this.ticketsLenght = this.rank_tickets.length;
            this.user_info.push(element);
            console.log(this.user_info);
            this.user = element.user.name;
            element.id = 'anchor';
            element.class = 'arrow arrow_toogle rotate';
            this.user = element.user.name;
          }
          this.userClass = element.user.name;
        }
      });
    });
  }

  ngOnInit() {
    // console.log(this.isLoadingGroup);
    // console.log(this.authenticated);
    if (this.authenticated && this.auth.getUser().verify) {
      this.getTiers();
    } else if (this.authenticated && !this.auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    } else {
      // this.router.navigate(['/desktop']);
      this.isLoadingGroup = false;
    }
    setTimeout(() => {
      this.showTicket();
    }, 1000);
    this.subscriptionToggle = this.auth.toggleUsersTiers
    .subscribe(
      (val) => {
        this.togBtn = val;
      }
    );
  }


  getTiers() {
    this.http.getAllTiersRankings().subscribe( tickets => {
      console.log(tickets);
      tickets['tiers'].sort((one, two) => (one.name > two.name ? -1 : 1));
      tickets['tiers'].reverse();
      if (tickets['tiers'].length === 0) {
        this.isloading = false;
        this.redirect = true;
        this.isLoadingGroup = false;
        this.show = false;
        this.timeRank = new Date().toISOString();
      } else {
        tickets['tiers'].forEach((ticket) => {
          this.tiers.push(ticket);
        });
        if (this.tiers[0]) {
          this.tiers.forEach(element => {
            element.t = +element.name.slice(5);
          });
          this.sortTier = this.tiers.sort((a, b) => {
            return a.price - b.price;
          });
          this.tierId = this.sortTier[0]['_id'];
          this.showTier(this.tierId);
          this.sortTier = this.tiers.sort((a, b) => {
            return a.price - b.price;
          });
          let lenTiers = Math.ceil(this.tiers.length / 4);
          for (let i = 0; i < lenTiers; i++) {
            this.allTiers[i] = this.tiers.splice(0, 4);
          }
        }
      }
    });
  }

  // getRank() {
    // console.log(this.rankings);
    // this.http.rankingsPage(this.tierId).subscribe((rank: {
    //   rankings : any,
    //   time: any
    // }) => {
    //   if (rank.time) {
    //     this.timeRank = rank.time;
    //   } else {
    //     this.timeRank = new Date().toISOString();
    //   }
    //   console.log(rank.rankings);
    //   this.isloading = false;
    //   if (rank.rankings.length > 0) {
    //     this.rankings = rank.rankings.sort((a, b) => {
    //       return b.points - a.points;
    //     });
    //   }
    //   this.user_storage = JSON.parse(localStorage.getItem('user'));
    //   this.rankings.forEach((element, i) => {
    //     let data = element;
    //     data.position = i + 1 ;
    //     if (element.user.name === this.user_storage.name) {
    //       this.addClass = true;
    //       this.rank_tickets = [];
    //       if (element.tickets) {
    //         element.tickets.forEach((el) => {
    //           this.rank_tickets.push({'points' : el.points});
    //         });
    //         if (this.rank_tickets[9]) {
    //           this.rank_tickets[9].id = 'last';
    //         }
    //         this.ticketsLenght = this.rank_tickets.length;
    //         this.user_info.push(element);
    //         element.id = 'anchor';
    //         element.class = 'arrow arrow_toogle rotate';
    //         this.user = element.user.name;
    //       }
    //       this.userClass = element.user.name;
    //     }
    //   });
    // });
  // }
}
