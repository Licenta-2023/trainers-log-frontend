import {Component, OnInit} from '@angular/core';
import {Reservation} from "../shared/models";
import {ReservationService} from "../services/reservation.service";
import {AuthService} from "../auth/auth.service";

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

  constructor(private reservationService: ReservationService, private authService: AuthService) {
  }

  ngOnInit() {
    this.areReservationsLoading = false;
    this.initiateDateVariables();
    this.loadUserReservations();
  }

  private initiateDateVariables() {
    const today = new Date();
    this.selectedDate = today.toISOString().substring(0, 10);
    this.selectedDay = today.getDate();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
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
    this.reservationService.getUserReservationsByYearAndMonthAndDay(username, this.selectedYear, this.selectedMonth, this.selectedDay).subscribe(reservations => {
      this.reservations.push(...reservations);
    });
  }
}
