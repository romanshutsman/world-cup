import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/auth/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DesktopComponent } from './pages/desktop/desktop.component';
import { MenuComponent } from './pages/menu/menu.component';
import { BuyTicketComponent } from './pages/buy-ticket/buy-ticket.component';

import { ApiService } from './services/api/api.service';
import { NotificationService } from './services/notification/notification.service';
import { AuthenticationService } from './services/auth/authentication.service';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MyGamesComponent } from './pages/my-games/my-games.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { FilterComponent } from './pages/filter/filter.component';
import { RulesComponent } from './pages/rules/rules.component';
import { AccountComponent } from './pages/account/account.component';
import { BuyTeamComponent } from './pages/buy-team/buy-team.component';
import { GamesComponent } from './pages/games/games.component';
import { RankingsComponent } from './pages/rankings/rankings.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { PaypalSuccessComponent } from './pages/paypal-success/paypal-success.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PaypalWrongComponent } from './pages/paypal-wrong/paypal-wrong.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { AuthGuard } from './services/auth/auth-guard.service';
import { AdminGuard } from './services/auth/admin-guard.service';
import { TeamsComponent } from './pages/teams/teams.component';
import { HeaderNotificationComponent } from './pages/header-notification/header-notification.component';
import { BuySellListComponent } from './pages/teams/buy-sell-list/buy-sell-list.component';
import { TeamMenuComponent } from './pages/teams/team-menu/team-menu.component';
import { TeamFlagComponent } from './pages/teams/team-flag/team-flag.component';
import { LoadingComponent } from './loading/loading.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { UserTierComponent } from './pages/account/user-tier/user-tier.component';
import { CreateComponent } from './pages/account/user-tier/create/create.component';
import { MyTiersComponent } from './pages/account/user-tier/my-tiers/my-tiers.component';
import { InvitationComponent } from './pages/account/user-tier/invitation/invitation.component';
import { HttpModule } from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader  } from 'ng2-translate';
import { Http } from '@angular/http';
import { AcceptOfferComponent } from './pages/accept-offer/accept-offer.component';
import {SearchPipe} from './pages/desktop/search.pipe';

import { DataService } from './services/data/data.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DesktopComponent,
    MenuComponent,
    BuyTicketComponent,
    ForgotPasswordComponent,
    MyGamesComponent,
    NewPasswordComponent,
    FilterComponent,
    RulesComponent,
    AccountComponent,
    BuyTeamComponent,
    GamesComponent,
    RankingsComponent,
    ConfirmEmailComponent,
    NotFoundComponent,
    PaypalSuccessComponent,
    AdminComponent,
    PaypalWrongComponent,
    TeamsComponent,
    HeaderNotificationComponent,
    BuySellListComponent,
    TeamMenuComponent,
    TeamFlagComponent,
    LoadingComponent,
    ProfileComponent,
    UserTierComponent,
    CreateComponent,
    MyTiersComponent,
    InvitationComponent,
    AcceptOfferComponent,
    SearchPipe
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SnotifyModule,
    TagInputModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (Http: Http) => new TranslateStaticLoader(Http, '/assets/i18n', '.json'),
      deps: [Http]
      })
  ],
  providers: [
    ApiService,
    AuthenticationService,
    NotificationService,
    DesktopComponent,
    HeaderNotificationComponent,
    DataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: 'SnotifyToastConfig',
      useValue: ToastDefaults},
    SnotifyService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent],
  exports: [BrowserModule, TranslateModule, HttpModule]
})
export class AppModule { }
