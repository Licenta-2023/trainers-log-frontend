import {Component, OnInit} from '@angular/core';
import {ScaleType} from "@swimlane/ngx-charts";
import {ReservationService} from "../../services/reservation.service";
import * as moment from "moment";
@Component({
  selector: 'app-home-page-chart',
  templateUrl: './home-page-chart.component.html',
  styleUrls: ['./home-page-chart.component.css']
})
export class HomePageChartComponent implements OnInit {
  single: any[] = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Total Reservations';

  colorScheme = {
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#10c7ba']
  };

  constructor(private reservationService: ReservationService) {
  }

  ngOnInit() {
    const today = moment().subtract(1, 'month');
    const currentYear = today.year()
    const lastMonth = today.month() + 2;
    const lastMonthName = today.format("MMMM");
    this.yAxisLabel = 'Total Reservations for ' + lastMonthName;
    this.reservationService.getReservationsStatistics(currentYear, lastMonth).subscribe(reservationData => {
      console.log(reservationData);
      this.single = reservationData;
    })
  }
}
