import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {Moment} from "moment";
import {CalendarEntry, CalendarEntryStatus, Trainer, TrainerFullNameAndUsername} from "../shared/models";
import {TrainerService} from "../services/trainer.service";
import {ReservationService} from "../services/reservation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit{

  selectedDate: Moment;
  selectedDay: string;
  selectedMonth: string;
  selectedMonthShort: string;
  selectedMonthNumber: number;
  selectedYear: number;
  entries: CalendarEntry[];

  trainers: TrainerFullNameAndUsername[] = [];
  selectedTrainer: TrainerFullNameAndUsername = {} as TrainerFullNameAndUsername;
  selectedTrainerFullInfo: Trainer;
  isCalendarLoaded: boolean = false;

  constructor(private trainerService: TrainerService, private reservationService: ReservationService, private router: Router) {
  }

  ngOnInit(): void {
    this.selectedDate = moment();
    this.loadTrainers();
    this.calculateDateVariables();
  }

  calculateDateVariables() {
    this.selectedMonth = this.selectedDate.format("MMMM");
    this.selectedMonthShort = this.selectedDate.format("MMM");
    this.selectedMonthNumber = +this.selectedDate.format("M");
    this.selectedYear = this.selectedDate.year();
    this.entries = Array(this.selectedDate.daysInMonth()).fill({}).map((elem, index) => {
      return { date: `${index + 1} - ${this.selectedMonthShort}`, status: CalendarEntryStatus.AVAILABLE};
    });
    console.log(this.selectedTrainer);
  }

  onDecrementMonth() {
    this.selectedDate.subtract(1, 'month');
    this.calculateDateVariables();
    if(this.selectedTrainer.username) {
      this.loadSelectedTrainerCalendarForSelectedMonth();
    }
  }

  onIncrementMonth() {
    this.selectedDate.add(1, 'month');
    this.calculateDateVariables();
    if(this.selectedTrainer.username) {
      this.loadSelectedTrainerCalendarForSelectedMonth();
    }
  }

  onTrainerChange() {
    this.loadTrainerFullInfo();
  }

  private loadTrainers() {
    this.trainerService.getTrainersFullnameAndUsername().subscribe(data => {
      this.trainers.push(...data);
    })
  }

  private loadSelectedTrainerCalendarForSelectedMonth() {
    this.reservationService.getTrainerReservationsByMonth(this.selectedTrainer.username, this.selectedYear, this.selectedMonthNumber).subscribe(data => {
      console.log(data);
      const reservationsByDate = data.reduce((acc, reservation) => {
        const date = reservation.timeIntervalBegin.split(' ')[0];
        acc[date] = acc[date] ? acc[date] + 1 : 1;
        return acc;
      }, {})
      this.setAvailabilityForEachDay(reservationsByDate);
    });
  }

  private loadTrainerFullInfo() {
    this.trainerService.getTrainerFullInfo(this.selectedTrainer.username).subscribe(trainer => {
      this.selectedTrainerFullInfo = trainer;
      this.loadSelectedTrainerCalendarForSelectedMonth();
    });
  }

  private setAvailabilityForEachDay(reservationsByDate: object) {
    Object.entries(reservationsByDate).forEach(([date, nrOfReservations]) => {
      const index = +date.split('-')[0] - 1;
      const maxReservationSlotsForTrainer = this.trainerService.getMaxReservationSlotsForTrainer(this.selectedTrainerFullInfo);
      if (nrOfReservations === maxReservationSlotsForTrainer) {
        this.entries[index].status = CalendarEntryStatus.FULL;
      } else if (nrOfReservations >= maxReservationSlotsForTrainer/2) {
        this.entries[index].status = CalendarEntryStatus.BUSY;
      }
    });
    this.isCalendarLoaded = true;
  }

  onCalendarEntryClick(entry: CalendarEntry, day: number) {
    if (entry.status === CalendarEntryStatus.FULL) {
      return;
    }
    this.router.navigate(["/calendar/addReservation"], {
      queryParams: {
        day: day,
        month: this.selectedMonthNumber,
        year: this.selectedYear,
        trainerName: this.selectedTrainer.fullName,
        trainerUsername: this.selectedTrainer.username
      }
    })
  }
}
