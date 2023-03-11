import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-calendar-entry',
  templateUrl: './calendar-entry.component.html',
  styleUrls: ['./calendar-entry.component.css']
})
export class CalendarEntryComponent {
  @Input()
  date: string;
}
