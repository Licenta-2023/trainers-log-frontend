import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../../services/reservation.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as moment from "moment";
import {Reservation, ReservationEntry, ReservationType, Trainer} from "../../shared/models";
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

  public trainerUsername: string;
  public trainerFullInfo: Trainer;

  private selectedReservation: ReservationEntry;

  constructor(private reservationService: ReservationService, private route: ActivatedRoute, private router: Router, private trainerService: TrainerService, private authService: AuthService){}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const loggedUsername = this.authService.getLoggedUsername();
      if (params.isTrainerLogged === 'true' && params.trainerUsername !== loggedUsername) {
        this.redirectTrainer(loggedUsername);
      } else {
        this.loadDateInformationFromQueryParams(params);
        this.loadTrainerInformationFromQueryParams(params);
        this.loadTrainer();
      }
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
    if (!params.trainerUsername) {
      this.router.navigate(['../'], { relativeTo: this.route})
    }
    this.trainerUsername = params.trainerUsername;
  }

  private loadTrainerReservations() {
    this.reservationService.getTrainerReservationsByYearAndMonthAndDay(this.trainerUsername, this.year, this.month, this.day).subscribe(reservations => {
      this.populateTheReservationArray(reservations);
    });
  }

  private loadTrainer() {
    this.trainerService.getTrainerFullInfo(this.trainerUsername).subscribe(data => {
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
      const currentSlotReservations = groupedReservations.get(currentTimeInterval.format("HH:mm:ss"));
      this.addReservationEntryToArray(currentSlotReservations, currentTimeInterval, groupedReservations);
    }
  }

  private isReservationFullForGivenTimeSlot(currentTimeInterval: string, reservationsByTimeMap: Map<string, Reservation[]>, totalClientsPerReservation: number) {
    const reservationsForCurrentTimeInterval = reservationsByTimeMap.get(currentTimeInterval);

    return !!reservationsForCurrentTimeInterval &&
      (reservationsForCurrentTimeInterval.length === totalClientsPerReservation || this.disableBlockerIfTrainerAndReservationExists(reservationsForCurrentTimeInterval.length));
  }

  private addReservationEntryToArray(currentSlotReservations: Reservation[], currentTimeInterval: moment.Moment, groupedReservations: Map<string, Reservation[]>) {
    let reservationEntry: ReservationEntry;
    if (currentSlotReservations) {
      const belongsToCurrentUser = currentSlotReservations.map(reservation => reservation.client.username).includes(this.authService.getLoggedUsername());
      const isBlocker = currentSlotReservations.some(reservation => reservation.reservationType === ReservationType.BLOCKER);
      reservationEntry = {
        startTime: moment(currentSlotReservations[0].timeIntervalBegin.split(' ')[1], "HH:mm:ss").format('HH:mm'),
        endTime: moment(currentSlotReservations[0].timeIntervalBegin.split(' ')[1], "HH:mm:ss").add(1, 'hour').format('HH:mm'),
        belongsToCurrentUser,
        isFull: belongsToCurrentUser || isBlocker || this.isReservationFullForGivenTimeSlot(moment(currentSlotReservations[0].timeIntervalBegin.split(' ')[1], "HH:mm:ss").format("HH:mm:ss"), groupedReservations, this.trainerFullInfo.totalClientsPerReservation)
      }
    } else {
      reservationEntry = {
        startTime: moment(currentTimeInterval).format("HH:mm"),
        endTime: moment(currentTimeInterval).add(1, 'hour').format("HH:mm"),
        belongsToCurrentUser: false,
        isFull: this.isReservationFullForGivenTimeSlot(moment(currentTimeInterval).format("HH:mm:ss"), groupedReservations, this.trainerFullInfo.totalClientsPerReservation)
      }
    }
    reservationEntry.isFull ||= reservationEntry.isFull && moment(`${this.day}-${this.month}-${this.year} ${currentTimeInterval.format('HH:mm')}`, "DD-MM-YYYY HH:mm").isBefore(moment.now());
    this.reservationEntries.push(reservationEntry);
  }

  public onSlotSelected(reservationEntry: ReservationEntry) {
    this.selectedReservation = reservationEntry;
    const isBlocker = this.authService.getLoggedUserRoles();
    if(confirm('Please confirm the reservation')) {
      this.reservationService.makeReservation(
        this.authService.getLoggedUsername(),
        this.trainerUsername,
        `${this.year}-${this.month > 9 ? this.month : '0' + this.month}-${this.day > 9 ? this.day : '0' + this.day}T${reservationEntry.startTime}`,
        isBlocker ? ReservationType.BLOCKER : ReservationType.TRAINING
      ).subscribe(() => {
        this.loadTrainerReservations();
      })
    } else {
      this.selectedReservation = null;
    }
  }

  onLoadNewDate() {
    const newDay = new Date(this.selectedDate).getDate();
    const newMonth = new Date(this.selectedDate).getMonth() + 1;
    const newYear = new Date(this.selectedDate).getFullYear();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        day: newDay,
        month: newMonth,
        year: newYear
      }
    })
  }

  redirectTrainer(trainerUsername: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        trainerUsername
      }
    })
  }

  private disableBlockerIfTrainerAndReservationExists(length: number) {
    const isTrainerLogged = this.authService.isTrainerLogged();
    return isTrainerLogged && length > 0;
  }
}
