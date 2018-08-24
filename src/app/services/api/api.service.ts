import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import * as JWT from 'jwt-decode';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { BuyTier } from './../../pages/model/buytier.model';
import {post} from "selenium-webdriver/http";
import { Subscription } from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

const API_URL = environment.apiUrl;
const API_USER =  environment.apiUrl  + '/u';

@Injectable()
export class ApiService {
  response: Observable<any>;

  toggleSwitch = new Subject<boolean>();
  public tog = true;




  constructor(private http: HttpClient) {
    // this.toggleSwitch.subscribe(
    //   (val) => {
    //     this.tog = val;
    //   }
    // );
    // this.tog = JSON.parse(localStorage.getItem('tog'));
  }


  public register(body) {
    return this.http.post(API_URL + '/auth/register', body);
  }

  public login(body) {
    return this.http.post(API_URL + '/auth/login', body);
  }

  public token(token) {
    return this.http.get(API_URL + '/auth/' + token);
  }

  public forgotPassword(body) {
    return this.http.post(API_URL + '/auth/forgot_password', body);
  }

  public resetPassword(body) {
    return this.http.patch(API_URL + '/auth/reset_password', body);
  }

  public emailVerification(body) {
    return this.http.post(API_URL + '/auth/confirm', body);
  }

  public resendConfirmEmail(id) {
    return this.http.get(API_URL + '/auth/verify/' + id);
  }

  public getDataTable() {
    return this.http.get(API_URL + '/standings')
      .map((data: Response) => {
        return data;
      });
  }

  public getTimeMatches(stage) {
    return this.http.get(API_URL + '/match/' + stage)
      .map((timeTable: Response) => {
        return timeTable;
      });
  }

  public getAllTiers() {
      return this.http.get(API_URL + '/tier/tiers')
      .map((data: Response) => {
        return data;
      });
  }
  public getAllTiersRankings(){
    if (!this.tog) {
      return this.http.get(API_URL + '/tier/tiers')
      .map((data: Response) => {
        return data;
      });
    } else {
      return this.http.get(API_USER + '/tier/tiers')
      .map((data: Response) => {
        return data;
      });
    }
  }

  public getTierById(id) {
    return this.http.get(API_URL + '/tier/' + id);
  }

  public buyTier(body) {
    return this.http.post(API_URL + '/ticket/buy', body);
  }
  public buyTierWithoutPaypal(body) {
    return this.http.post(API_USER + '/ticket/buy', body);
  }

  public getNews(team) {
    return this.http.get(API_URL + '/news/team/' + team)
      .map((news: Response) => {
        return news;
      });
  }
  public getTiers(userId) {
    if (!this.tog) {
      return this.http.get(API_URL + '/ticket/' + userId);
      } else {
      return this.http.get(API_USER + '/ticket/' + userId);
    }
  }

  public showGames(userId, tireId, ticketId) {
    if (!this.tog) {
      return this.http.get(API_URL + '/games?userId=' + userId + '&tierId=' + tireId + '&ticketId=' + ticketId)
      .map((games: Response) => {
        return games;
      });
    } else {
      return this.http.get(API_USER + '/games?userId=' + userId + '&tierId=' + tireId + '&ticketId=' + ticketId)
      .map((games: Response) => {
        return games;
      });
    }
  }

  public makeBet(body) {
    if (!this.tog) {
      return this.http.post(API_URL + '/bet', body);
    } else {
      return this.http.post(API_USER + '/bet', body);
    }
  }

  public rankingsPage(tierID) {
    if (!this.tog) {
      return this.http.get(API_URL + '/rankings/' + tierID);
    } else {
      return this.http.get(API_USER + '/rankings/' + tierID);
    }
  }

  public editBet(body) {
    if (!this.tog) {
      return this.http.patch(API_URL + '/bet', body);
    } else {
      return this.http.patch(API_USER + '/bet', body);
    }
  }

  public showUserGames(userId, tireId, ticketId) {
    if (!this.tog) {
      return this.http.get(API_URL + '/games/user/' + userId + '?tierId=' + tireId + '&ticketId=' + ticketId);
    } else {
      return this.http.get(API_USER + '/games/user/' + userId + '?tierId=' + tireId + '&ticketId=' + ticketId);
    }
  }

  public changePassword(body) {
    return this.http.patch(API_URL + '/auth/password', body);
  }

  public addTier(tier) {
    return this.http.post(API_URL + '/tier/create', tier);
  }

  public getRanking(ticketID, userID ) {
    if (!this.tog) {
      return this.http.get(API_URL + '/rankings/' + ticketID + '/' + userID)
      .map((rank: Response) => {
        return rank ;
      });
    } else {
      return this.http.get(API_USER + '/rankings/' + ticketID + '/' + userID)
      .map((rank: Response) => {
        return rank ;
      });
    }
  }

  public createUserTier(body) {
    return this.http.post(API_URL + '/u/tier/create', body);
  }

  public getUserTiers(userId) {
    return this.http.get(API_URL + '/u/tier');
  }

  public increasePrize(tierId) {
    return this.http.patch(API_URL + '/tier/increase/' + tierId, '');
  }

  public getUserTierById(tierId) {
    return this.http.get(API_URL + '/u/tier/' + tierId);
  }

  public getUserAcceptedTiers() {
    return this.http.get(API_URL + '/u/tier/tiers');
  }

  public sendInvitation(body) {
    return this.http.post(API_URL + '/u/tier/invite', body);

  }

  public notification() {
    return this.http.get(API_URL + '/notification');
  }

  public readAll() {
    return this.http.patch(API_URL + '/notification', '');
  }

  public readOne(notificationId) {
    return this.http.patch(API_URL + '/notification/' + notificationId, '');
  }



  public getInvitation() {
    return this.http.get(API_URL + '/u/tier/invitation');
  }

  public acceptTierInvitation(invitationId) {
    return this.http.post(API_URL + '/u/tier/invitation/' + invitationId, '');
  }

  public rejectTierInvitation(invitationId) {
    return this.http.delete(API_URL + '/u/tier/invitation/' + invitationId);
  }

  public buyUserTicket(body) {
    return this.http.post(API_URL + '/u/ticket/buy', body);
  }

  public resendUserTierInvitation(invitationId) {
    return this.http.post(API_URL + '/u/tier/invite/' + invitationId, '');
  }

  public createOffer(data: any) {
    return this.http.post(API_URL + '/exchange/create', data);
  }

  public getOffers() {
    return this.http.get(API_URL + '/exchange/offers');
  }

  public myTeamList() {
    return this.http.get(API_URL + '/exchange/purchases');
  }

  public mySellList() {
    return this.http.get(API_URL + '/exchange/sells');
  }

  public teamAccept(offerId) {
    return this.http.post(API_URL + '/exchange/accept/' + offerId, '');
  }

  public teamReject(offerId) {
    return this.http.patch(API_URL + '/exchange/reject/' + offerId, '');
  }

  public routeToPayPal(offerId) {
    return this.http.post(API_URL + '/exchange/buy/' + offerId, '');
  }

  public oddWins() {
    return this.http.get(API_URL + '/news/winner');
  }
  public updateTierName(tierId, body) {
    return this.http.patch(API_USER + '/tier/' +  tierId, body);
  }
  public deleteTier(tierId) {
    return this.http.delete(API_USER + '/tier/' +  tierId);
  }


}
