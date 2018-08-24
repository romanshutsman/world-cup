import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ApiService } from '../../services/api/api.service';
import { NotificationService } from '../../services/notification/notification.service';
import 'rxjs/add/operator/toPromise';
import { DataService } from './../../services/data/data.service';
import { $ } from 'jquery';
declare const $;

@Component({
  moduleId : module.id,
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']

})

export class DesktopComponent  implements OnInit {
  public isloadingNews = true;
  public isloadingTicket = true;

  Response: any;

  groupA: any;
  groupB: any;
  groupC: any;
  groupD: any;
  groupE: any;
  groupF: any;
  groupG: any;
  groupH: any;

  timeGroupA: any = [];
  timeGroupB: any = [];
  timeGroupC: any = [];
  timeGroupD: any = [];
  timeGroupE: any = [];
  timeGroupF: any = [];
  timeGroupG: any = [];
  timeGroupH: any = [];

  tier1: any = [];
  team: any = [];

  news_1: any = [];
  news_1_title: any;
  news_1_description: any;
  news_1_img: any;
  news_1_link: any;

  news_2: any = [];
  news_2_title: any;
  news_2_description: any;
  news_2_img: any;
  news_2_link: any;

  news_3: any = [];
  news_3_title: any;
  news_3_description: any;
  news_3_img: any;
  news_3_link: any;

  getTeam;
  selectedCountry: any;
  subscriptionToggle: Subscription;
  togTier;

  objectKeys = Object.keys;

  public adminLogIn;
  public userTiers;
  public userId: string;
  public isloadingUserTicket = false;
  styleForHead = false;
  subscriptionLang: Subscription;
  myFuncCalls = 0;
  countries: any;
   final_1_8 = {};
   final_1_4 = {};
   final_1_2 = {};
   place_3 = {};
   final = {};

  public selectedValue: any = [];
  public searchUser: any = '';
  public tierCheck: any = [];
  public tierOwner: any = [];
  public tierMatch: any = [];
  public showBtn = true;
  public userTiersLength = 0;
  public tierCarousel = 1;


  constructor(private router: Router,
              private myHttp: ApiService,
              private auth: AuthenticationService,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private data: DataService ) {
      this.countries = this.data.countries;
      this.final_1_8 = this.data.final_1_8;
      this.final_1_4 = this.data.final_1_4;
      this.final_1_2 = this.data.final_1_2;
      this.place_3 = this.data.place_3;
      this.final = this.data.final;
      if (auth.isAuthenticated() ) {
        this.userId = auth.getUser().userId;
        console.log(auth.isAuthenticated() )
      }
      this.route.queryParams.subscribe(params => {
        if (params.token) {
          const body = {
            token: params.token
          };
        this.myHttp.emailVerification(body).subscribe(
          (data: any) => {
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('refresh_token', JSON.stringify(data.refreshToken));
          }, err => {
            console.log(err);
            this.router.navigate(['/confirm-email']);
          }, () => {
            this.router.navigateByUrl('/desktop', { skipLocationChange: true }).then(() =>
              this.router.navigate(['/desktop']));
          }
        );
       }
      });

      this.myHttp.getDataTable().subscribe(
        data => {
          this.Response = data;
          this.groupA = data['groupA'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupB = data['groupB'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupC = data['groupC'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupD = data['groupD'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupE = data['groupE'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupF = data['groupF'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupG = data['groupG'].sort((a, b) => {
            return a['position'] - b['position'];
          });
          this.groupH = data['groupH'].sort((a, b) => {
            return a['position'] - b['position'];
          });
        }
    );

    this.getMatchesByStage('group');
    this.getTiers();
    this.getTeam = JSON.parse(localStorage.getItem('team'));
    if (this.getTeam) {
      this.getNews(this.getTeam);
    }else {
      this.getNews(this.countries[0]);
    }
  }

    ngOnInit() {
      this.getUserTiers();
      this.subscriptionToggle = this.auth.toggleUsersTiers
      .subscribe(
        (val) => {
          this.togTier = val;
          if (this.auth.isAuthenticated()) {
            // this.getUserTiers();
          }
        }
      );
      if (this.auth.isAuthenticated()) {
        if (this.auth.getUser().admin) {
          console.log(this.auth.getUser().admin);
          this.adminLogIn = this.auth.getUser().admin;
        } else {
          this.adminLogIn = false;
        }
      }
      // this.getUserTiers();

      this.subscriptionLang = this.auth.chooseLang
      .subscribe(
        (e) => {
          // console.log(e);
          if (e == 'pt') {
            this.styleForHead = true;
          } else {
            this.styleForHead = false;
          }
        }
      );
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);

    }
    getUserTiers() {
      // this.userTiers
      console.log('hello');
      console.log(this.auth.isAuthenticated());
      this.tierCheck = [];
      this.tierOwner = [];
      this.isloadingUserTicket = true;
      if (this.auth.isAuthenticated()) {
        this.myHttp.getUserAcceptedTiers()
          .subscribe(
            (tiers) => {
              console.log(tiers);
              this.userTiers = tiers['tiers'];
              this.userTiersLength = this.userTiers.length;
              console.log(this.userTiers);
              this.userTiers = tiers['tiers'];
              this.userTiers.forEach(element => {
                element.nameStage = [];
                for (let i = 0; i < element.stage.length; i++) {
                  if (element.stage[i] === 'group') {
                    element.nameStage.push('Groups');
                  }
                  if (element.stage[i] === 'roundOf16') {
                    element.nameStage.push('1/8');
                  }
                  if (element.stage[i] === 'quarter') {
                    element.nameStage.push('1/4');
                  }
                  if (element.stage[i] === 'semi') {
                    element.nameStage.push('1/2');
                  }
                  if (element.stage[i] === 'third') {
                    element.nameStage.push('3rd Place');
                  }
                  if (element.stage[i] === 'final') {
                    element.nameStage.push('Final');
                  }
                }
              });
              if(tiers['tiers'].length > 0) {
                tiers['tiers'].forEach(elem => {
                  this.tierOwner.push(elem.owner);
                  this.tierCheck.push(elem._id);
                });
                // && element.tier.owner == this.tierOwner[i]
                this.myHttp.getTiers(this.userId).subscribe(tickets => {
                  for (let i = 0; i < this.tierCheck.length; i++) {
                    console.log('FFFF');
                    this.tierCarousel = tickets['tickets'].length;
                    console.log(this.tierCarousel);
                    tickets['tickets'].forEach(element => {
                      if (element.tier._id == this.tierCheck[i]) {
                        if (element.count > 0) {
                          this.tierMatch.push(element.tier._id);
                          this.showBtn = false;
                        }
                      }
                    });
                  }
                });
              }
              this.isloadingUserTicket = false;

            }
          );
        }
    }
    getUserTierById(tierId) {
      if (this.auth.isAuthenticated()) {
        const body = {
          'userId': this.auth.getUser().userId,
          'tierId': tierId
        };
        this.myHttp.buyTierWithoutPaypal(body).subscribe((resp) => {
          window.location.href = Object.values(resp)[0];
        },
        (error) => {
          this.router.navigate(['/paypal-wrong']);
        })
      }
    }

    getTiers() {
      this.myHttp.getAllTiers().subscribe(
        getTier => {
          console.log(getTier);
          this.Response = getTier;
          this.tier1 = getTier['tiers'];
          this.tier1.forEach(element => {
            element.t = +element.name.slice(5);
          });
          this.isloadingTicket = false;
        });
    }
    checkAdmin() {
      if (this.auth.isAuthenticated()) {
        const a = this.auth.getUser().admin;
        if (this.auth.getUser().admin === undefined) {
          return false;
        }
        if (this.auth.getUser().admin === true) {
          return true;
        }
      }
    }
    increasePrize(_tierId) {
      this.myHttp.increasePrize(_tierId).subscribe(
        data => {
          this.notificationService.successMsg('Prize have been updated!', 'Success');
          this.getTiers();
        },
        (error) => {
          this.notificationService.errorMsg(error, 'Error');
        }
      );
    }

    drop() {
      $('.dropdown-menu li a').click(function(){
        let selText = $(this).text();
        $(this).parents('.btn-group').find('.dropdown-toggle.select').html(selText + ' <span class="caret"></span>');
      });
    }

    buyTicket(tierId) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/buy-ticket', tierId]);
    } else {
      this.auth.clickedBuyTicket.next(true);
    }
  }

    getNews(teamObj) {
     this.selectedCountry = teamObj.name;
      localStorage.setItem('team', JSON.stringify(teamObj));
      this.getTeam =   teamObj;

      for (let i = 0; i < 32; i++) {
        if (this.getTeam.id === this.countries[i]['id']) {
            this.selectedValue = this.countries[i];
          }
      }
      this.myHttp.getNews(this.getTeam.id).subscribe(
      t => {
          this.Response = t;
          this.team = t['news'];

          this.news_1 = this.team[0];
          this.news_1_img = this.news_1['image'];
          this.news_1_title = this.news_1['title'];
          this.news_1_description = this.news_1['description'];
          this.news_1_link = this.news_1['link'];

          this.news_2 = this.team[1];
          this.news_2_img = this.news_2['image'];
          this.news_2_title = this.news_2['title'];
          this.news_2_description = this.news_2['description'];
          this.news_2_link = this.news_2['link'];

          this.news_3 = this.team[2];
          this.news_3_img = this.news_3['image'];
          this.news_3_title = this.news_3['title'];
          this.news_3_description = this.news_3['description'];
          this.news_3_link = this.news_3['link'];

          this.isloadingNews = false;

        }
      );
    }

    scroll_down() {
      const el = document.querySelector('.scroll');
      this.smooth_scroll_to(el, el.scrollTop + 235, 600);
    }

    scroll_up() {
      const el = document.querySelector('.scroll');
      this.smooth_scroll_to(el, el.scrollTop - 235, 600);
    }

    smooth_scroll_to(element: any, target: any, duration: any) {
      target = Math.round(target);
      duration = Math.round(duration);
      if (duration < 0) {
          return Promise.reject('bad duration');
      }
      if (duration === 0) {
          element.scrollTop = target;
          return Promise.resolve();
      }
      const start_time = Date.now();
      const end_time = start_time + duration;
      const start_top = element.scrollTop;
      const distance = target - start_top;
      const smooth_step = function(start, end, point) {
          if (point <= start) { return 0; }
          if (point >= end) { return 1; }
          const x = (point - start) / (end - start);
          return x * x * (3 - 2 * x);
      };

      return new Promise(function(resolve, reject) {
        let previous_top = element.scrollTop;

        const scroll_frame = function() {
            if (element.scrollTop !== previous_top) {
              console.log('error');
                reject('interrupted');
                return;
            }
            const now = Date.now();
            const point = smooth_step(start_time, end_time, now);
            const frameTop = Math.round(start_top + (distance * point));
            element.scrollTop = frameTop;
            if (now >= end_time) {
                resolve();
                return;
            }
            if (element.scrollTop === previous_top
                && element.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollTop;
            setTimeout(scroll_frame, 0);
        };
        setTimeout(scroll_frame, 0);
      });
    }
    goToAccount() {
      this.router.navigate(['/account/user-tier/create']);
    }

    getMatchesByStage(stage) {
      this.myHttp.getTimeMatches(stage).subscribe(
        timeTable => {
          if (stage === 'group') {
            this.timeGroupA = timeTable['groupA'];
            this.timeGroupB = timeTable['groupB'];
            this.timeGroupC = timeTable['groupC'];
            this.timeGroupD = timeTable['groupD'];
            this.timeGroupE = timeTable['groupE'];
            this.timeGroupF = timeTable['groupF'];
            this.timeGroupG = timeTable['groupG'];
            this.timeGroupH = timeTable['groupH'];
          }else if (stage === 'roundOf16') {
            if (timeTable[stage]) {
              for (let i = 0; i < timeTable[stage].length; i++) {
                if (this.final_1_8[timeTable[stage][i].formatted_date]) {
                  timeTable[stage][i].index = this.final_1_8[timeTable[stage][i].formatted_date].index;
                  this.final_1_8[timeTable[stage][i].formatted_date] = timeTable[stage][i];
                }
              }
            }
          }else if (stage === 'quarter') {
            if (timeTable[stage]) {
              for (let i = 0; i < timeTable[stage].length; i++) {
                if (this.final_1_4[timeTable[stage][i].formatted_date]) {
                  timeTable[stage][i].index = this.final_1_4[timeTable[stage][i].formatted_date].index;
                  this.final_1_4[timeTable[stage][i].formatted_date] = timeTable[stage][i];
                }
              }
            }
          }else if (stage === 'semi') {
            if (timeTable[stage]) {
              for (let i = 0; i < timeTable[stage].length; i++) {
                if (this.final_1_2[timeTable[stage][i].formatted_date]) {
                  timeTable[stage][i].index = this.final_1_2[timeTable[stage][i].formatted_date].index;
                  this.final_1_2[timeTable[stage][i].formatted_date] = timeTable[stage][i];
                }
              }
            }
          }else if (stage === 'third') {
            if (timeTable[stage]) {
              for (let i = 0; i < timeTable[stage].length; i++) {
                timeTable[stage][i].index = this.place_3[timeTable[stage][i].formatted_date].index;
                this.place_3[timeTable[stage][i].formatted_date] = timeTable[stage][i];
              }
            }
          }else if (stage === 'final') {
            if (timeTable[stage]) {
              this.final[timeTable[stage][0].formatted_date] = timeTable[stage][0];
            }
          }
        }
      );
    }
}
