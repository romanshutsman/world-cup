import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import {ApiService} from '../../services/api/api.service';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {$} from 'jquery';
import { DataService } from './../../services/data/data.service';
declare var $: any;

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.css']
})


export class MyGamesComponent implements OnInit {
  authenticated: boolean;
  today = new Date();
  public isloading = true;
  public percent_completed: any;
  public userId: any;
  public tickets: any = [];
  public tiers: any = [];
  public ticket: any = [];
  public bets: any = [];
  public betskeys: any = [];
  public redirect = false;
  public allTier = new Array();
  public sortTier;
  public selectedIndex: number;
  public selectedTier;
  public ticketId;
  public tierId;
  public group_stage;
  public play_off;
  disableCheckboxAll: any;
  disableGroupCheckbox: any;
  public disableCheckbox: any = [];
  public isLoadingGroup = true;
  public selectedGroup: any = [];
  selectedAll: any;
  public result;
  public games: any;
  public rankings: any = [];
  sortSelectGroup: any;
  dataAttr: any;
  check;
  rank;
  subscriptionToggle: Subscription;
  public togBtn;

  constructor(
    private myHttp: ApiService,
    private auth: AuthenticationService,
    private router: Router,
    private data: DataService) {
    this.authenticated = this.auth.isAuthenticated();
    this.group_stage = this.data.group_stage2;
    this.play_off = this.data.play_off;
  }

  showTier(tierShow) {
    this.selectedTier = tierShow;
  }

  showTicket(ticketId) {
    this.isLoadingGroup = true;
    this.selectedIndex = ticketId;
  }

  showDrop(drop) {
    $(drop).on('show.bs.dropdown', function () {
      document.getElementById('carousel_inner').style.height = '390px';
      $(drop).off('hide.bs.dropdown', function () {
      });
    });
    $(drop).on('hide.bs.dropdown', function () {
      document.getElementById('carousel_inner').style.height = '100%';
    });
  }

  ngOnInit() {
    if (this.authenticated && this.auth.getUser().verify) {
      this.userId = this.auth.getUser();
      this.myHttp.getTiers(this.userId.userId).subscribe(tickets => {
        tickets['tickets'].sort((one, two) => (one.tier.name > two.tier.name ? -1 : 1));
        tickets['tickets'].reverse();
        console.log(tickets['tickets']);
        if (tickets['tickets'].length === 0) {
          console.log('ddd');
          this.disableCheckboxAll = true;
          this.check = tickets['tickets'].length;
          console.log(this.check);
          for (let i = 0; i < this.play_off.length; i++) {
            if (this.play_off[i].value) {
              this.play_off[i].selected = false;
              this.disableCheckbox[i] = true;
              this.dataAttr = 'tool';
            }
          }
          this.isloading = false;
          this.isLoadingGroup = false;
          this.redirect = true;
        } else if (tickets['tickets'].length > 0) {
          this.check = tickets['tickets'].length;
          console.log(this.check);
          tickets['tickets'].forEach((ticket) => {
            this.tiers.push(ticket);
          });
          this.sortTier = this.tiers.sort((a, b) => {
            return a.tier.price - b.tier.price;
          });
          this.ticketId = this.sortTier[0].ticketsId[0];
          this.tierId = this.sortTier[0].tier['_id'];
          this.showTier(this.tierId);
          this.showTicket(this.ticketId);
          this.myHttp.showUserGames(this.userId.userId, this.tiers[0].tier['_id'], this.tiers[0]['ticketsId'][0]).subscribe(
            (firstTickets) => {
              if (firstTickets['games'].length === 0) {
                this.result = firstTickets['games'];
                this.disableGroupCheckbox = true;
                this.disableCheckboxAll = true;
                this.redirect = true;
                this.isloading = false;
                this.isLoadingGroup = false;
                this.playoff();
              } else {
                this.redirect = false;
                setTimeout(() => {
                  this.isloading = false;
                }, 0);
                this.isLoadingGroup = false;
                this.myHttp.getRanking(this.ticketId, this.userId.userId)
                  .map((match: Response) => {
                    return match;
                  }).subscribe(
                  (arr: any) => {
                    this.rank = arr;
                    this.rank.forEach(el => {
                      for (let i = 0; i < firstTickets['games'].length; i++) {
                        if (el.match_id === firstTickets['games'][i].match.id) {
                          this.rankings[el.match_id] = el.points;
                        }
                      }
                    });
                  }
                );
                this.redirect = false;
                setTimeout(() => {
                  this.isloading = false;
                }, 0);
                this.isLoadingGroup = false;
                firstTickets['games'].map((ticket) => {
                  this.modifyData(ticket);
                });
                this.result = firstTickets['games'];
                this.percent_completed = Math.ceil(this.result.length / 64 * 100);
                this.playoff();
                this.betskeys = Object.keys(this.bets);
                this.betskeys.sort((a, b) => a - b);
                console.log(this.bets);
                this.bets.sort((x: any, y: any) => {
                  return x.datejs - y.datejs;
                });
                this.isloading = false;
              }
              let lenTiers = Math.ceil(this.tiers.length / 4);
              for (let i = 0; i < lenTiers; i++) {
                this.allTier[i] = this.tiers.splice(0, 4);
              }
            });

        } else {
          this.isloading = false;
          this.isLoadingGroup = false;
        }
      });
    } else if (this.auth.isAuthenticated() && !this.auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    }
    this.subscriptionToggle = this.auth.toggleUsersTiers
    .subscribe(
      (val) => {
        this.togBtn = val;
      }
    );
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
  }
  goToAccount() {
    this.router.navigate(['/account/user-tier/create']);
  }
  modifyData(ticket) {
    const dateIso = new Date(ticket.match.formatted_date);
    const date = new Date(dateIso.getUTCFullYear(), dateIso.getMonth(), dateIso.getDate());
    const dateRound = new Date(dateIso.getUTCFullYear(), dateIso.getMonth(), dateIso.getDate(), dateIso.getHours(), dateIso.getMinutes());
    const data = ticket;
    const differentMilisec = dateRound.getTime() - this.today.getTime();
    const closeRoundDays = Math.floor(differentMilisec / (1000 * 3600 * 24));
    const closeRoundHours = Math.floor(differentMilisec / (1000 * 3600) - closeRoundDays * 24);
    const closeRoundMinutes = Math.floor(differentMilisec / (1000 * 60) - (closeRoundDays * 24 * 60) - (closeRoundHours * 60));
    data.closeRoundDays = closeRoundDays;
    data.closeRoundHours = closeRoundHours;
    data.closeRoundMinutes = closeRoundMinutes;
    console.log(data);
    console.log(dateRound.getTime());
    console.log(this.today.getTime());

    if (!this.bets[date.getTime()]) {
      this.bets[date.getTime()] = [];
    }
    this.bets[date.getTime()].push(data);
  }

  getWidth() {
    return this.percent_completed + '%';
  }

  getTicket(tierId, ticketId) {
    this.selectedGroup = [];
    this.redirect = false;
    const groups = document.getElementsByClassName('group-stage') as HTMLCollectionOf<HTMLElement>;
    groups[0].style.display = 'none';

    for (let i = 0; i < this.group_stage.length; i++) {
      this.group_stage[i].selected = false;
      this.selectedAll = false;
    }
    for (let i = 0; i < this.play_off.length; i++) {
      this.play_off[i].selected = false;
    }
    this.bets = [];
    this.betskeys = [];
    this.myHttp.showUserGames(this.userId.userId, tierId, ticketId).subscribe(
      tickets => {
        this.isLoadingGroup = false;
        this.result = tickets['games'];
        if (this.result.length === 0) {
          this.disableGroupCheckbox = true;
          this.disableCheckboxAll = true;
          this.playoff();
        } else if (this.result.length > 0) {
          this.myHttp.getRanking(ticketId, this.userId.userId)
            .map((match: Response) => {
              return match;
            }).subscribe(
            (arr: any) => {
              this.rank = arr;
              this.rank.forEach(el => {
                for (let i = 0; i < tickets['games'].length; i++) {
                  if (el.match_id === tickets['games'][i].match.id) {
                    this.rankings[el.match_id] = el.points;
                  }
                }
              });
            }
          );
          this.disableGroupCheckbox = false;
          this.disableCheckboxAll = false;
          this.playoff();
        }
        this.percent_completed = Math.ceil(this.result.length / 64 * 100);
        this.getWidth();

        if (tickets['games'].length > 0) {
          this.redirect = false;
          tickets['games'].map((ticket) => {
            this.modifyData(ticket);
          });
          this.playoff();
          this.betskeys = Object.keys(this.bets);
          this.betskeys.sort((a, b) => a - b);
          this.bets.sort((x: any, y: any) => {
            return x.datejs - y.datejs;
          });
        } else {
          this.redirect = true;
        }
      });

  }

  showRankings(matchId, ticketId) {
    this.myHttp.getRanking(ticketId, this.userId.userId)
      .map((match: Response) => {
        return match;
      }).subscribe(
      (arr: any) => {
        this.rank = arr;
        this.rank.forEach(el => {
          if (el.match_id === matchId) {
            this.rankings[matchId] = el.points;
          }
        });
      }
    );
  }


  selectAll() {
    this.redirect = false;
    // this.isLoadingGroup = false;
    for (let i = 0; i < this.group_stage.length; i++) {
      this.group_stage[i].selected = this.selectedAll;

      if (this.selectedAll === true) {
        this.isLoadingGroup = true;
        setTimeout(() => {
          this.isLoadingGroup = false;
        }, 300);
        setTimeout(() => {
          if (this.betskeys.length === 0) {
            this.redirect = true;
          }
        }, 300);
        for (let i = 0; i < this.group_stage.length; i++) {
          if ((this.selectedGroup.indexOf('group' + this.group_stage[i].name) === -1) && (this.group_stage[i].selected === true)) {
            this.selectedGroup.push('group' + this.group_stage[i].name);
          }
        }
      } else if (this.selectedAll === false) {

        this.isLoadingGroup = true;
        setTimeout(() => {
          this.isLoadingGroup = false;
        }, 300);
        setTimeout(() => {
          if (this.betskeys.length === 0) {
            this.redirect = true;
          }
        }, 300);
        const group = 'group' + this.group_stage[i].name;
        this.selectedGroup = this.selectedGroup.filter(e => e !== group);
      }
    }
    if (this.selectedGroup.length > 0) {
      this.bets = [];
      for (let j = 0; j < this.selectedGroup.length; j++) {
        for (let i = 0; i < this.result.length; i++) {
          if (this.result[i].match.stage === this.selectedGroup[j]) {
            this.modifyData(this.result[i]);
          }
        }
      }
      this.betskeys = Object.keys(this.bets);
      this.betskeys.sort((a, b) => {
        return a - b;
      });
    } else if (this.selectedGroup.length === 0) {

      this.bets = [];
      const arr = this.selectedGroup;
      this.sortSelectGroup = arr.sort(function (a, b) {
        return a - b;
      });
      for (let i = 0; i < this.result.length; i++) {

        if (this.result[i].match.stage) {
          this.modifyData(this.result[i]);
        }

      }
      this.betskeys = Object.keys(this.bets);
      this.betskeys.sort((a, b) => {
        return a - b;
      });
      // if (this.betskeys.length === 0) {
      //   this.redirect = true;
      // } else {
      //   this.redirect = false;
      // }
    }
    this.selectedAll = this.group_stage.every(function (item: any) {
      return item.selected === true;
    });
  }


  checkGroup(event, checkbox) {

 // group-Filter

    this.redirect = false;
    if (checkbox.selected === true) {
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
      }, 300);
      setTimeout(() => {
        if (this.betskeys.length === 0) {
          this.redirect = true;
        }
      }, 300);
      this.selectedGroup.push(checkbox.nameGroup);
    } else if (checkbox.selected === false) {
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
      }, 300);
      setTimeout(() => {
        if (this.betskeys.length === 0) {
          this.redirect = true;
        }
      }, 300);
      const group = checkbox.nameGroup;
      this.selectedGroup = this.selectedGroup.filter(e => e !== group);
    }

    if (this.selectedGroup.length > 0) {
      this.bets = [];
      const arr = this.selectedGroup;
      this.sortSelectGroup = arr.sort(function (a, b) {
        return a - b;
      });
      for (let j = 0; j < this.result.length; j++) {
        for (let i = 0; i < this.result.length; i++) {
          if (this.result[i].match.stage === this.sortSelectGroup[j]) {
            this.modifyData(this.result[i]);
          }
        }
      }

      // playoff-Filter


      for (let i = 0; i < this.play_off.length; i++) {
        if ((this.play_off[i].selected === true) && (this.selectedGroup.indexOf(this.play_off[i].value) === -1)) {
          this.selectedGroup.push(this.play_off[i].value);
        } else if (this.play_off[i].selected === false) {
          const group = this.play_off[i].value;
          this.selectedGroup = this.selectedGroup.filter(e => e !== group);
        }
      }
      if (this.selectedGroup.length > 0) {
        this.bets = [];
        for (let j = 0; j < this.selectedGroup.length; j++) {
          for (let i = 0; i < this.result.length; i++) {
            if (this.result[i].match.stage === this.selectedGroup[j]) {
              this.modifyData(this.result[i]);
            }
          }
        }

      } else if (this.selectedGroup.length === 0) {

        this.bets = [];
        for (let i = 0; i < this.result.length; i++) {

          if (this.result[i]) {
            this.modifyData(this.result[i]);
          }

        }

      }


      this.betskeys = Object.keys(this.bets);
      this.betskeys.sort((a, b) => {
        return a - b;
      });
    } else if (this.selectedGroup.length === 0) {

      this.bets = [];
      const arr = this.selectedGroup;
      this.sortSelectGroup = arr.sort(function (a, b) {
        return a - b;
      });
      for (let i = 0; i < this.result.length; i++) {

        if (this.result[i].match.stage) {
          this.modifyData(this.result[i]);
        }

      }
      this.betskeys = Object.keys(this.bets);
      this.betskeys.sort((a, b) => {
        return a - b;
      });
    }
    this.selectedAll = this.group_stage.every(function (item: any) {
      return item.selected === true;
    });
  }

  playoff() {
    for (let d = 0; d < this.play_off.length; d++) {
      this.disableCheckbox[d] = true;
      this.dataAttr = 'tool';
    }
    for (let j = 0; j < this.result.length; j++) {
      for (let i = 0; i < this.play_off.length; i++) {
        if (this.play_off[i].value === this.result[j].match.stage) {
          this.disableCheckbox[i] = false;
          if (this.result[j].match.stage === 'roundOf16') {
            setTimeout(() => {
              $('.group-1-8').find('div').removeClass('tool');
            }, 0);
          }
          if (this.result[j].match.stage === 'quarter') {
            setTimeout(() => {
              $('.group-1-4').find('div').removeClass('tool');
            }, 0);
          }
          if (this.result[j].match.stage === 'semi') {
            setTimeout(() => {
              $('.group-1-2').find('div').removeClass('tool');
            }, 0);
          }
          if (this.result[j].match.stage === 'third') {
            setTimeout(() => {
              $('.group-3-place').find('div').removeClass('tool');
            }, 0);
          }
          if (this.result[j].match.stage === 'final') {
            setTimeout(() => {
              $('.group-final').find('div').removeClass('tool');
            }, 0);
          }
        }
      }
    }
  }


  isActive(tog) {
    if (tog) {
      tog = false;
      return tog;
    } else {
      tog = true;
      return tog;
    }
  }

  show() {
    if (1) {
      const groups = document.getElementsByClassName('group-stage') as HTMLCollectionOf<HTMLElement>;
      groups[0].style.display === 'block' ? groups[0].style.display = 'none' : groups[0].style.display = 'block';
    }
  }
}


