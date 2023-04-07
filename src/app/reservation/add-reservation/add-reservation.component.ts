import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../../services/reservation.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as moment from "moment";
import {Reservation, ReservationEntry, Trainer, TrainerFullNameAndUsername} from "../../shared/models";
import {TrainerService} from "../../services/trainer.service";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit{
  public reservationEntries: ReservationEntry[];
  public day: number;
  public month: number;
  public year: number;
  public selectedDate: string;

  public trainerInfo: TrainerFullNameAndUsername = {} as TrainerFullNameAndUsername;
  public trainerFullInfo: Trainer;

  public areReservationsLoading: boolean = true;

  private selectedReservation: ReservationEntry;

  constructor(private reservationService: ReservationService, private route: ActivatedRoute, private router: Router, private trainerService: TrainerService, private authService: AuthService){}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadDateInformationFromQueryParams(params);
      this.loadTrainerInformationFromQueryParams(params);
      this.loadTrainer();
    });
  }

  private loadDateInformationFromQueryParams(params: Params) {
    const today = moment();
    this.day = +params.day || today.date();
    this.month = +params.month || today.month() + 1;
    this.year = +params.year || today.year();
    const date = new Date(this.year, this.month - 1, this.day + 1 );
    this.selectedDate = date.toISOString().substring(0, 10);
  }

  private loadTrainerInformationFromQueryParams(params: Params) {
    if (!params.trainerUsername || !params.trainerFullName) {
      this.router.navigate(['../'], { relativeTo: this.route})
    }
    this.trainerInfo.username = params.trainerUsername;
    this.trainerInfo.fullName = params.trainerFullName;
  }

  private loadTrainerReservations() {
    this.reservationService.getTrainerReservationsByYearAndMonthAndDay(this.trainerInfo.username, this.year, this.month, this.day).subscribe(reservations => {
      this.populateTheReservationArray(reservations);
    });
  }

  private loadTrainer() {
    this.trainerService.getTrainerFullInfo(this.trainerInfo.username).subscribe(data => {
      this.trainerFullInfo = data;
      this.loadTrainerReservations();
    })
  }

  private populateTheReservationArray(reservations: Reservation[]) {
    this.reservationEntries = []
    const startDate = moment(this.trainerFullInfo.startOfDay, 'HH:mm:ss')
    const endDate = moment(this.trainerFullInfo.endOfDay, 'HH:mm:ss')

    const groupedReservations = reservations.reduce((acc, reservation) => {
      const timeIntervalBegin = moment(reservation.timeIntervalBegin.split(' ')[1], "HH:mm:ss").format('HH:mm:ss');
      const group = acc.get(timeIntervalBegin) || [];
      group.push(reservation);
      acc.set(timeIntervalBegin, group);
      return acc;
    }, new Map<string, Reservation[]>());

    for (let currentTimeInterval = moment(startDate); currentTimeInterval.isBefore(endDate); currentTimeInterval = moment(currentTimeInterval).add(1, 'hour')) {
      const currentSlotReservation1 = groupedReservations.get(currentTimeInterval.format("HH:mm:ss"));
      this.addReservationEntryToArray(currentSlotReservation1, currentTimeInterval, groupedReservations);
    }
    console.log(this.reservationEntries)
  }

  private isReservationFullForGivenTimeSlot(currentTimeInterval: string, reservationsByTimeMap: Map<string, Reservation[]>, totalClientsPerReservation: number) {
    const reservationsForCurrentTimeInterval = reservationsByTimeMap.get(currentTimeInterval);
    return !!reservationsForCurrentTimeInterval && reservationsForCurrentTimeInterval.length === totalClientsPerReservation;
  }

  private addReservationEntryToArray(currentSlotReservation: Reservation[], currentTimeInterval: moment.Moment, groupedReservations: Map<string, Reservation[]>) {
    let reservationEntry: ReservationEntry;
    if (currentSlotReservation) {
      const belongsToCurrentUser = currentSlotReservation.map(reservation => reservation.client).includes(this.authService.getLoggedUsername());
      reservationEntry = {
        startTime: moment(currentSlotReservation[0].timeIntervalBegin.split(' ')[1], "HH:mm:ss").format('HH:mm'),
        endTime: moment(currentSlotReservation[0].timeIntervalBegin.split(' ')[1], "HH:mm:ss").add(1, 'hour').format('HH:mm:ss'),
        belongsToCurrentUser,
        isFull: belongsToCurrentUser || this.isReservationFullForGivenTimeSlot(moment(currentSlotReservation[0].timeIntervalBegin.split(' ')[1], "HH:mm:ss").format("HH:mm:ss"), groupedReservations, this.trainerFullInfo.totalClientsPerReservation)
      }
    } else {
      reservationEntry = {
        startTime: moment(currentTimeInterval).format("HH:mm"),
        endTime: moment(currentTimeInterval).add(1, 'hour').format("HH:mm"),
        belongsToCurrentUser: false,
        isFull: this.isReservationFullForGivenTimeSlot(moment(currentTimeInterval).format("HH:mm:ss"), groupedReservations, this.trainerFullInfo.totalClientsPerReservation)
      }
    }

    this.reservationEntries.push(reservationEntry);
  }

  public onSlotSelected(reservationEntry: ReservationEntry) {
    this.selectedReservation = reservationEntry;
    if(confirm('Please confirm the reservation')) {
      this.reservationService.makeReservationAsUser(
        this.authService.getLoggedUsername(),
        this.trainerInfo.username,
        `${this.year}-${this.month > 9 ? this.month : '0' + this.month}-${this.day > 9 ? this.day : '0' + this.day}T${reservationEntry.startTime}`,
      ).subscribe(() => {
        this.loadTrainerReservations();
      })
    } else {
      this.selectedReservation = null;
    }
  }
}
