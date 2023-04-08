import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {RegisterComponent} from "./register/register.component";
import {LogInComponent} from "./log-in/log-in.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {AuthGuard} from "./auth/auth.guard";
import {CalendarComponent} from "./calendar/calendar.component";
import {AddReservationComponent} from "./reservation/add-reservation/add-reservation.component";
import {MyReservationsComponent} from "./my-reservations/my-reservations.component";

const routes: Routes = [
  {path: '', component: HomePageComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'log-in', component: LogInComponent},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuard]},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  {path: 'calendar/addReservation', component: AddReservationComponent, canActivate: [AuthGuard]},
  {path: 'my-reservations', component: MyReservationsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
