import {Component, OnInit} from '@angular/core';
import {Reservation} from "../shared/models";
import {ReservationService} from "../services/reservation.service";
import {AuthService} from "../auth/auth.service";
import * as moment from "moment";

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit{
  areReservationsLoading: boolean = true;

  reservations: Reservation[];
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string;
  isTrainerLogged: boolean = false;

  constructor(private reservationService: ReservationService, private authService: AuthService) {
  }

  ngOnInit() {
    this.initiateDateVariables();
    this.loadUserReservations();
  }

  private initiateDateVariables() {
    const today = new Date();
    this.selectedDay = today.getDate();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    this.selectedDate = moment(today).format("YYYY-MM-DD");
  }

  onDateChange() {
    const date = new Date(this.selectedDate);
    this.selectedDay = date.getDate();
    this.selectedMonth = date.getMonth() + 1;
    this.selectedYear = date.getFullYear();
    this.loadUserReservations();
  }

  private loadUserReservations() {
    const username = this.authService.getLoggedUsername();
    this.reservations = [];
    if (this.authService.isTrainerLogged()) {
      this.isTrainerLogged = true;
      this.reservationService.getTrainerReservationsByYearAndMonthAndDay(username, this.selectedYear, this.selectedMonth, this.selectedDay).subscribe(reservations => {
        this.reservations.push(...reservations);
        this.filterReservationsByDate();
        this.areReservationsLoading = false;
      });
    } else {
      this.reservationService.getUserReservationsByYearAndMonthAndDay(username, this.selectedYear, this.selectedMonth, this.selectedDay).subscribe(reservations => {
        this.reservations.push(...reservations);
        this.filterReservationsByDate();
        this.areReservationsLoading = false;
      });
    }
  }

  onDeleteReservation(reservation: Reservation, index: number) {
    if(confirm(`Are you sure you want to delete the reservation for ${reservation.timeIntervalBegin}?`)) {
      console.log(reservation);
      this.reservationService.deleteReservation(
        reservation.client.username,
        reservation.trainer.username,
        moment(reservation.timeIntervalBegin, "DD-MM-YYYY hh:mm:ss").format("YYYY-MM-DDTHH:mm"),
        reservation.reservationType
      ).subscribe(data => {
        this.reservations.splice(index, 1);
      })
    }
  }

  filterReservationsByDate() {
    this.reservations.sort((r1, r2) => {
      const t1 = new Date(r1.timeIntervalBegin).getTime();
      const t2 = new Date(r2.timeIntervalBegin).getTime();
      return t1 - t2;
    })
  }
}
