import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {Moment} from "moment";
import {Trainer, TrainerFullNameAndUsername} from "../shared/models";
import {TrainerService} from "../services/trainer.service";
import {ReservationService} from "../services/reservation.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit{

  selectedDate: Moment;
  selectedMonth: string;
  selectedMonthShort: string;
  selectedMonthNumber: number;
  selectedYear: number;
  entries: any;

  trainers: TrainerFullNameAndUsername[] = [];
  selectedTrainer: TrainerFullNameAndUsername = {} as TrainerFullNameAndUsername;
  selectedTrainerFullInfo: Trainer;
  isCalendarLoaded: boolean = false;

  constructor(private trainerService: TrainerService, private reservationService: ReservationService) {
  }

  ngOnInit(): void {
    this.selectedDate = moment();
    this.calculateDateVariables();
    this.loadTrainers();
  }

  calculateDateVariables() {
    this.selectedMonth = this.selectedDate.format("MMMM");
    this.selectedMonthShort = this.selectedDate.format("MMM");
    this.selectedMonthNumber = +this.selectedDate.format("M");
    this.selectedYear = this.selectedDate.year();
    this.entries = Array(this.selectedDate.daysInMonth()).fill({}).map((elem, index) => {
      return `${index + 1} - ${this.selectedMonthShort}`;
    });
  }

  onDecrementMonth() {
    this.selectedDate.subtract(1, 'month');
    this.calculateDateVariables();
    this.loadSelectedTrainerCalendarForSelectedMonth();
  }

  onIncrementMonth() {
    this.selectedDate.add(1, 'month');
    this.calculateDateVariables();
    this.loadSelectedTrainerCalendarForSelectedMonth();
  }

  onTrainerChange(selectedTrainer: TrainerFullNameAndUsername) {
    console.log(selectedTrainer);
    this.loadTrainerFullInfo();
    this.loadSelectedTrainerCalendarForSelectedMonth();
  }

  private loadTrainers() {
    this.trainerService.getTrainersFullnameAndUsername().subscribe(data => {
      this.trainers.push(...data);
    })
  }

  private loadSelectedTrainerCalendarForSelectedMonth() {
    this.reservationService.getTrainerReservationsByMonth(this.selectedTrainer.username, this.selectedMonthNumber).subscribe(data => {
      console.log(data);
      this.isCalendarLoaded = true;
    });
  }

  private loadTrainerFullInfo() {
    this.trainerService.getTrainerFullInfo(this.selectedTrainer.username).subscribe(trainer => {
      this.selectedTrainerFullInfo = trainer;
      console.log(this.selectedTrainerFullInfo);
    });
  }
}
