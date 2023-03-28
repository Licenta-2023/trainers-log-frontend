import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LogInComponent } from './log-in/log-in.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './navbar/navbar.component';
import { UsersListComponent } from './users-list/users-list.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarEntryComponent } from './calendar/calendar-entry/calendar-entry.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import { AddReservationComponent } from './reservation/add-reservation/add-reservation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LogInComponent,
    RegisterComponent,
    NavbarComponent,
    UsersListComponent,
    CalendarComponent,
    CalendarEntryComponent,
    AddReservationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbCollapseModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
