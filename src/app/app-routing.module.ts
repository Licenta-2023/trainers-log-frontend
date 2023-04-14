import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {RegisterComponent} from "./register/register.component";
import {LogInComponent} from "./log-in/log-in.component";
import {AuthGuard} from "./auth/auth.guard";
import {CalendarComponent} from "./calendar/calendar.component";
import {AddReservationComponent} from "./reservation/add-reservation/add-reservation.component";
import {MyReservationsComponent} from "./my-reservations/my-reservations.component";
import {ProfileComponent} from "./profile/profile.component";
import {AdminAuthGuard} from "./auth/admin-auth.guard";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminEditUserComponent} from "./admin-dashboard/admin-edit-user/admin-edit-user.component";
import {ChangePasswordComponent} from "./profile/change-password/change-password.component";

const routes: Routes = [
  {path: '', component: HomePageComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'log-in', component: LogInComponent},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  {path: 'calendar/addReservation', component: AddReservationComponent, canActivate: [AuthGuard]},
  {path: 'my-reservations', component: MyReservationsComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile/changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminAuthGuard]},
  {path: 'admin/edit', component: AdminEditUserComponent, canActivate: [AuthGuard, AdminAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
