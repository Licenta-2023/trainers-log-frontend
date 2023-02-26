import {Component, OnInit} from '@angular/core';
import * as moment from "moment";
import {Moment} from "moment";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit{

  selectedDate: Moment;
  selectedMonth: string;
  selectedMonthShort: string;
  selectedYear: number;
  entries: any;

  ngOnInit(): void {
    this.selectedDate = moment();
    this.calculateDateVariables();
  }

  calculateDateVariables() {
    this.selectedMonth = this.selectedDate.format("MMMM");
    this.selectedMonthShort = this.selectedDate.format("MMM");
    this.selectedYear = this.selectedDate.year();
    this.entries = Array(this.selectedDate.daysInMonth()).map(() => 0)
  }

  onDecrementMonth() {
    this.selectedDate.subtract(1, 'month');
    this.calculateDateVariables();
  }

  onIncrementMonth() {
    this.selectedDate.add(1, 'month');
    this.calculateDateVariables();
  }
}
