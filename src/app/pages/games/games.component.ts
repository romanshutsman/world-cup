import {Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {ApiService} from '../../services/api/api.service';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {Router} from '@angular/router';
import {$} from 'jquery';
import {NotificationService} from '../../services/notification/notification.service';
import {HeaderNotificationComponent} from '../../pages/header-notification/header-notification.component';
import { DataService } from './../../services/data/data.service';
declare const $;

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  authenticated: boolean;
  today = new Date();
  public disableCheckbox: any = [];
  public allTier = new Array();
  public isloading = true;
  public isLoadingGroup = true;
  public sortTier;
  public selectedIndex: number;
  public selectedTier;
  public userId: any;
  public bets: any = [];
  public betskeys: any = [];
  public tiers: any = [];
  public tierId;
  public ticketId;
  public localScore: any = [];
  public visitorScore: any = [];
  public redirect = false;
  public group_stage: any;
  public play_off: any;
  public edit: any = [];
  selectedAll: any;
  public userTierChose: any;
  public userTicketChose: any;
  public selectedValue: any = [];
  public unfillLoading = false;
  public myBetLoading = false;
  public AllTierTickets;
  public groups;
  public result;
  public arrow: false;
  public allBets;
  public myBet = false;
  public unfillBet = false;
  public dataAttr;
  public info_table;
  public tierLocal;
  public ticketLocal;
  public check;
  public hideAfterEdit = false;


  subscriptionToggle: Subscription;
  togTier;
  public ticketsArray: any = [];
  public sortUserTier;
  public allUserTier = new Array();
  
  public not_exist = false;
  public checkUser;
  public checkUserGroups;
  public checkUser1_8;
  public checkGroup = false;
  public played = false;
  constructor(private http: ApiService,
              private auth: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService,
              public head: HeaderNotificationComponent,
              public data: DataService) {
    $('.dropdown-menu li a').click(function () {
      $(this).parents('.dropdown').find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents('.dropdown').find('.btn').val($(this).data('value'));
    });
    this.userId = this.auth.getUser();
    this.authenticated = this.auth.isAuthenticated();
    this.allBets = [
      {name: 'Groups', selected: false, value: 'allgroups'}
    ];
    this.group_stage = this.data.group_stage;
    this.play_off = this.data.play_off;
  }

  myBetCheck() {
    this.myBet = !this.myBet;
    if (this.unfillBet) {
      this.unfillBet = false;
    }
  }

  unfillBetCheck() {
    this.unfillBet = !this.unfillBet;
    if (this.myBet) {
      this.myBet = false;
    }
  }

  checkedAllGroups() {
    for (let i = 0; i < 8; i++) {
      this.group_stage[i].selected = this.selectedAll;
    }
  }

  groupsSelected() {
    for (let i = 0; i < 8; i++) {
      if (!this.group_stage[i].selected) {
        this.selectedAll = false;
        return false;
      }
    }
    this.selectedAll = true;
  }

  ngOnInit() {
    if (this.auth.isAuthenticated() && this.auth.getUser().verify) {
      this.getTiers();
      // this.showBoughtBet();
    } else if (this.auth.isAuthenticated() && !this.auth.getUser().verify) {
      this.router.navigate(['/confirm-email']);
    }
    this.subscriptionToggle = this.auth.toggleUsersTiers
    .subscribe(
      (val) => {
        this.togTier = val;
        // console.log(!this.togTier);
        // console.log(this.checkGroup);
      }
    );
    this.togTier = true;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
  }

  defaultTicket() {
    this.ticketId = this.sortTier[0].ticketsId[0];
    this.tierId = this.sortTier[0].tier['_id'];
  }

  ticketFromStorage() {    
    this.tierLocal = JSON.parse(JSON.stringify(localStorage.getItem('tier')));
    this.ticketLocal = JSON.parse(JSON.stringify(localStorage.getItem('ticket')));
  }

  showBoughtBet() {
    this.ticketFromStorage();
    if (this.tierLocal === 'null') {
      this.tierLocal = null;
      this.ticketLocal = null;
    }
    if (this.tierLocal != null ) {
      this.showTier(this.tierLocal);
      this.showTicket(this.ticketLocal);
      setTimeout(() => {
        const activeSlide = document.querySelectorAll('.carousel-item');
        const lengthSlide = activeSlide.length;
        for (let i = 0; i < lengthSlide; i++) {
          if (activeSlide[i].classList.contains('active')) {
            activeSlide[i].classList.remove('active');
          }
        }
        const lenTiers = Math.ceil(this.allTier.length / 4);
        for (let k = 0; k < this.allTier.length; k++) {
          const element = this.allTier[k];
          if (element) {
            for (let j = 0; j < element.length; j++) {
              const el = element[j];
              if (element[j]) {
                if (el.ticketsId.includes(this.ticketLocal)) {
                  for (let q = 0; q < 1; q++) {
                    activeSlide[k].classList.add('active');
                  }
                }
              }
            }
          }
        }
        this.ticketId = this.ticketLocal;
        this.tierId = this.tierLocal;
      }, 1500);
      setTimeout(() => {
        localStorage.setItem('tier', JSON.stringify(null));
        localStorage.setItem('ticket', JSON.stringify(null));
      }, 1500);
    } else if (this.tierLocal == null) {
      this.tierLocal = this.tierId;
      this.ticketLocal = this.ticketId;
      this.showTier(this.tierLocal);
      this.showTicket(this.ticketLocal);
    }
  }

  display() {
    return 'none';
  }

  getTiers() {
    this.http.getTiers(this.userId.userId).subscribe(tickets => {
      tickets['tickets'].sort((one, two) => (one.tier.name > two.tier.name ? -1 : 1));
      tickets['tickets'].reverse();
      console.log(tickets['tickets']);
      this.check = tickets['tickets'].length;
      if (tickets['tickets'].length === 0) {
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
      } else {
        tickets['tickets'].forEach((ticket) => {
          this.tiers.push(ticket);
        });
        if (this.tiers[0]) {
          this.sortTier = this.tiers.sort((a, b) => {
            console.log(a);
            return a.tier.price - b.tier.price;
          });
          this.defaultTicket();
          this.ticketFromStorage();
          if (this.tierLocal === 'null') {
            this.showTier(this.tierId);
            this.showTicket(this.ticketId);
          }
          this.showGames();
          let lenTiers = Math.ceil(this.tiers.length / 4);
          for (let i = 0; i < lenTiers; i++) {
            this.allTier[i] = this.tiers.splice(0, 4);
          }
        }
        // console.log(this.tiers.length);
        if (this.tiers.length === 0) {
          this.not_exist = true;
        }
      }
    });
  }
  
  showGames() {
    this.showBoughtBet();
    this.http.showGames(this.userId.userId, this.tierLocal, this.ticketLocal).subscribe(
      tickets => {
        this.info_table = tickets['stage'];
        setTimeout(() => {
          this.isloading = false;
          this.not_exist = false;
        }, 0);
        this.isLoadingGroup = false;
        this.AllTierTickets = tickets['games'];
        // console.log(this.AllTierTickets.length);
        // this.checkUser = this.AllTierTickets.length;
        // console.log(this.checkUser, 'checkUser');
        setTimeout(() => {
          if (this.AllTierTickets.length === 0) {
            this.not_exist = true;
          } else {
            this.not_exist = false;
          }
        }, 300);
        this.betsFilter();
        this.modifyData(tickets['games']);
      });
  }

  betsFilter() { // 150 lines (filter) !!! todo
    this.myBetLoading = false;
    this.unfillLoading = false;
    this.result = [];
    let groupsChecked = false;
    let stageChecked = false;
    this.played = false;
    // group filter
    if (this.selectedAll) {
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
      }, 300);
      setTimeout(() => {
        this.not_exist = false;
      }, 0);
      this.result = this.AllTierTickets.filter((e) => {
        let stage = e.stage.slice(0, 5);
        if (stage === 'group') {
          return true;
        }
      });
    } else {
      setTimeout(() => {
        this.not_exist = false;
      }, 0);
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
      }, 300);
      for (let i = 0; i < this.group_stage.length; i++) {
        let groupsResult = [];
        if (this.group_stage[i].selected) {
          groupsChecked = true;
          groupsResult = this.AllTierTickets.filter((e) => {
            if (e.stage === this.group_stage[i].nameGroup) {
              return true;
            }
          });
          this.result = this.result.concat(groupsResult);
        }
      }
    }
    // disable
    for (let i = 0; i < this.play_off.length; i++) {
      let stageResult = [];
      stageResult = this.AllTierTickets.filter((e) => {
        if (this.play_off[i].value) {
          this.disableCheckbox[i] = true;
          this.dataAttr = 'tool';
          if (e.stage === 'roundOf16') {
            this.disableCheckbox[0] = false;
            setTimeout(() => {
              $('.group-1-8').find('div').removeClass('tool');
            }, 0);
          }
          if (e.stage === 'quarter') {
            this.disableCheckbox[1] = false;
            setTimeout(() => {
              $('.group-1-4').find('div').removeClass('tool');
            }, 0);
          }
          if (e.stage === 'semi') {
            this.disableCheckbox[2] = false;
            setTimeout(() => {
              $('.group-1-2').find('div').removeClass('tool');
            }, 0);
          }
          if (e.stage === 'third') {
            this.disableCheckbox[3] = false;
            setTimeout(() => {
              $('.group-3-place').find('div').removeClass('tool');
            }, 0);
          }
          if (e.stage === 'final') {
            this.disableCheckbox[4] = false;
            setTimeout(() => {
              $('.group-final').find('div').removeClass('tool');
            }, 0);
          }
        }

      });

    }

    // stage filter
    for (let i = 0; i < this.play_off.length; i++) {
      let stageResult = [];
      if (this.play_off[i].selected) {
        stageChecked = true;
        stageResult = this.AllTierTickets.filter((e) => {
          if (e.stage === this.play_off[i].value) {
            return true;
          }
        });
        this.result = this.result.concat(stageResult);
      }
    }
    if (this.result.length === 0 && !this.selectedAll && !stageChecked && !groupsChecked) {
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
      }, 300);
      this.result = this.AllTierTickets;
    }
    // my activity filter
    if (this.myBet) {
      this.result = this.result.filter((e) => {
        if (e.bet) {
          if (e.rankings) {
            this.played = true;
          }
          return true;
        }
      });
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
        if (this.result.length > 0) {
          this.myBetLoading = false;
        } else {
          this.myBetLoading = true;
        }
      }, 300);
      if (this.togTier) {
        if (this.result.length == 0) {
          this.result.bet = true;
        }
      }
    } else {
      this.myBetLoading = false;
    }

    if (this.unfillBet) {
      this.result = this.result.filter((e) => {
        if (!e.bet) {
          return true;
        }
      });
      this.isLoadingGroup = true;
      setTimeout(() => {
        this.isLoadingGroup = false;
        if (this.result.length > 0) {
          this.unfillLoading = false;
        } else {
          this.unfillLoading = true;
        }
      }, 300);
      if (this.togTier) {
        if (this.result.length == 0) {
          this.result.unfill = true;
        }
      }
    } else {
      this.unfillLoading = false;
    }
    if (this.togTier) {
      if (this.result.length == 0) {
        this.result.f = true;
      }
    }
    this.modifyData(this.result);
  }

  makeaBet(localScore, visitorScore, bet, event, bets, id, goal) {
    if (localScore < 0 || visitorScore < 0 || visitorScore > Math.floor(visitorScore) ||
      visitorScore > Math.floor(visitorScore) || localScore > 20 || visitorScore > 20) {
      this.notificationService.errorMsg('Please enter correct value !', 'Error');
    } else {
      const data = {
        ticketId: this.ticketId,
        tierId: this.tierId,
        userId: this.userId.userId,
        match_id: bet.id,
        localteam_id: bet.localteam_id,
        localteam_name: bet.localteam_name,
        localteam_score: localScore,
        visitorteam_id: bet.visitorteam_id,
        visitorteam_name: bet.visitorteam_name,
        visitorteam_score: visitorScore,
        first_goal: goal
      };
      event.target.style.display = 'none';
      this.http.makeBet(data).subscribe(() => {
        bet.bet = data;
          this.notificationService.successMsg('Bet have been made !', 'Success');
        },
        (error) => {
          this.notificationService.errorMsg(error.error.message, 'Error');
          this.localScore[bet.id] = '';
          this.visitorScore[bet.id] = '';
        });
    }
  }

  changingScore(bet) {
    if (this.localScore[bet.id] === 0 && this.visitorScore[bet.id] === 0) {
      this.selectedValue[bet.id] = null;
    }
  }

  editBet(bet) {
    if (bet.bet) {
      bet.edit = true;
    }
  }

  saveEditedBet(localScore, visitorScore, firstGoal, bet) {
    if (typeof(localScore) !== 'number' || typeof(visitorScore) !== 'number' ||
      visitorScore > Math.floor(visitorScore) || localScore > Math.floor(localScore) ||
      localScore < 0 || localScore > 20 || visitorScore < 0 || visitorScore > 20)  {
      this.notificationService.errorMsg('Please enter correct value !', 'Error');
      this.localScore[bet.id] = bet.localteam_score;
      this.visitorScore[bet.id] = bet.visitorteam_score;
    } else {
      this.edit[bet.id] = !this.edit[bet.id];
      const data = {
        userId: this.userId.userId,
        tierId: this.tierId,
        ticketId: this.ticketId,
        match_id: bet.id,
        localteam_score: localScore,
        visitorteam_score: visitorScore,
        first_goal: firstGoal
      };
      this.http.editBet(data)
        .subscribe(
          () => {
            // this.hideAfterEdit = true;
            this.notificationService.successMsg('Bet edited !', 'Success');
          },
          (error) => {
            this.notificationService.errorMsg(error.error.message, 'Error');
            this.localScore[bet.id] = bet.localteam_score;
            this.visitorScore[bet.id] = bet.visitorteam_score;
          });
      bet.edit = false;
      this.hideAfterEdit = true;
    }
  }

  showTier(tierShow) {
    this.userTierChose = tierShow;
    this.selectedTier = this.userTierChose;
  }

  showTicket(ticketId) {
    this.visitorScore = [];
    this.localScore = [];
    this.selectedValue = [];
    this.not_exist = false;
    this.isLoadingGroup = true;
    this.userTicketChose = ticketId;
    this.selectedIndex = this.userTicketChose;
  }

  getTicket(tierId, ticketId) {
    this.myBetLoading = false;
    this.unfillLoading = false;
    this.reset();
    const check = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < 16; i++) {
      (<HTMLInputElement>check[i]).checked = false;
    }
    const groups = document.getElementsByClassName('group-stage') as HTMLCollectionOf<HTMLElement>;
    groups[0].style.display = 'none';
    this.tierId = tierId;
    this.ticketId = ticketId;
    this.http.showGames(this.userId.userId, tierId, ticketId).subscribe(
      tickets => {
        this.AllTierTickets = tickets['games'];
        this.checkUser = this.AllTierTickets.length;
        console.log(this.checkUser);
        this.isLoadingGroup = false;
        this.modifyData(tickets['games']);
      });

      this.head.switchTog();

  }

  modifyData(tickets) {
      this.checkUser = tickets.length;
      console.log(this.checkUser);
      if (tickets.length === 0) {
        this.not_exist = true;
      } else {
        this.not_exist = false;
      }
      this.bets = [];
      for (let i = 0; i < this.group_stage.length; i++) {
        let stageResult = [];
        stageResult = this.AllTierTickets.filter((e) => {
          if (this.group_stage[i].value) {
            let stage = e.stage.slice(0, 5);
            if (stage === 'group') {
              this.checkGroup = false;
            } else {
              this.checkGroup = true;
            }
          }
  
        });
  
      }
      for (let i = 0; i < this.play_off.length; i++) {
        let stageResult = [];
        stageResult = this.AllTierTickets.filter((e) => {
          let stage = e.stage.slice(0, 5);
          if (stage === 'group') {
            this.checkGroup = false;
          }
          
          if (this.play_off[i].value) {
            this.disableCheckbox[i] = true;
            this.dataAttr = 'tool';
            if (e.stage === 'roundOf16') {
              this.disableCheckbox[0] = false;
              setTimeout(() => {
                $('.group-1-8').find('div').removeClass('tool');
              }, 0);
            }
            if (e.stage === 'quarter') {
              this.disableCheckbox[1] = false;
              setTimeout(() => {
                $('.group-1-4').find('div').removeClass('tool');
              }, 0);
            }
            if (e.stage === 'semi') {
              this.disableCheckbox[2] = false;
              setTimeout(() => {
                $('.group-1-2').find('div').removeClass('tool');
              }, 0);
            }
            if (e.stage === 'third') {
              this.disableCheckbox[3] = false;
              setTimeout(() => {
                $('.group-3-place').find('div').removeClass('tool');
              }, 0);
            }
            if (e.stage === 'final') {
              this.disableCheckbox[4] = false;
              setTimeout(() => {
                $('.group-final').find('div').removeClass('tool');
              }, 0);
            }
          }
  
        });
  
      }
      if (tickets.f == true) {
        this.checkUser = 1;
      }
      tickets.map((ticket) => {
        if (ticket.bet) {
          this.localScore[ticket.id] = ticket.bet.localteam_score;
          this.visitorScore[ticket.id] = ticket.bet.visitorteam_score;
          this.selectedValue[ticket.id] = ticket.bet.first_goal;
        }
        const data = ticket;
        data.edit = false;
        data.squad = ticket.localteam_squad.squad.concat(ticket.visitorteam_squad.squad);
        const dateIso = new Date(ticket.formatted_date);
        const date = new Date(dateIso.getUTCFullYear(), dateIso.getMonth(), dateIso.getDate());
        const dateRound = new Date(dateIso.getUTCFullYear(), dateIso.getMonth(), dateIso.getDate(), dateIso.getHours());
        const closeRoundDays = Math.floor((dateRound.getTime() - this.today.getTime()) / (1000 * 3600 * 24));
        data.closeRoundDays = closeRoundDays;
        data.closeRoundHours = +(((dateRound.getTime() - this.today.getTime()) /
          (1000 * 3600)).toFixed(2)) - (closeRoundDays * 24);
        if (!this.bets[date.getTime()]) {
          this.bets[date.getTime()] = [];
        }
        this.bets[date.getTime()].push(ticket);
      });
      this.betskeys = Object.keys(this.bets);
    
    if (tickets.length == 0){
      if (tickets.f == true && tickets.bet == true) {
        this.myBetLoading = true;
        this.checkUser = 1;
      } else if (tickets.f == true && tickets.unfill == true) {
        this.checkUser = 1;
      } else {
        this.checkGroup = true;
        this.checkUser = 0;
        for (let i = 0; i < 5; i++) {
          this.disableCheckbox[i] = true;
        }
      }
    }
  }

  show() {
    const groups = document.getElementsByClassName('group-stage') as HTMLCollectionOf<HTMLElement>;
    groups[0].style.display === 'block' ? groups[0].style.display = 'none' : groups[0].style.display = 'block';
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


  reset() {
    this.myBet = false;
    this.unfillBet = false;
    this.selectedAll = false;
    this.group_stage.forEach(group => {
      group.selected = false;
    });
    this.play_off.forEach(stage => {
      stage.selected = false;
    });
    console.log('reset');
    this.modifyData(this.AllTierTickets);
    console.log('reset2');
  }
}
