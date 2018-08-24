import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DesktopComponent } from './pages/desktop/desktop.component';
import { MenuComponent } from './pages/menu/menu.component';
import { BuyTicketComponent } from './pages/buy-ticket/buy-ticket.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MyGamesComponent } from './pages/my-games/my-games.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
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
import { AuthGuard } from './services/auth/auth-guard.service';
import { AdminGuard } from './services/auth/admin-guard.service';
import { TeamsComponent } from './pages/teams/teams.component';
import { LoadingComponent } from './loading/loading.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { UserTierComponent } from './pages/account/user-tier/user-tier.component';
import { CreateComponent } from './pages/account/user-tier/create/create.component';
import { MyTiersComponent } from './pages/account/user-tier/my-tiers/my-tiers.component';
import { InvitationComponent } from './pages/account/user-tier/invitation/invitation.component';
import { AcceptOfferComponent } from './pages/accept-offer/accept-offer.component';

const routes: Routes = [
  {path: '', redirectTo: 'desktop', pathMatch: 'full'},
  {path: 'login', component: DesktopComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'desktop', component: DesktopComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'buy-ticket/:tierId', component: BuyTicketComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'my-games', component: MyGamesComponent, canActivate: [AuthGuard]},
  {path: 'games', component: GamesComponent, canActivate: [AuthGuard]},
  {path: 'rules', component: RulesComponent},
  {path: 'rankings', component: RankingsComponent, canActivate: [AuthGuard]},
  {path: 'buy-team/:action/:offerId', component: BuyTeamComponent},
  {path: 'confirm-email', component: ConfirmEmailComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'reset-password/:token', component: NewPasswordComponent},
  {path: 'paypal-success', component: PaypalSuccessComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'paypal-wrong', component: PaypalWrongComponent},
  {path: 'teams', component: TeamsComponent, canActivate: [AuthGuard]},
  {path: 'user' , component: LoadingComponent},
  {path: 'accept-offer/:offerId' , component: AcceptOfferComponent},
  {path: 'account', component: AccountComponent, canActivate: [AuthGuard], canActivateChild : [AuthGuard], children: [
      {path: 'profile',   component: ProfileComponent},
      {path: 'user-tier', component: UserTierComponent, children: [
          {path: 'create',  component: CreateComponent},
          {path: 'my-tiers', component: MyTiersComponent},
          {path: 'invitation', component: InvitationComponent}
        ]}
    ]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
