import {Component, OnInit} from '@angular/core';
import {ReservationService} from "../../services/reservation.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as moment from "moment";
import {Trainer, TrainerFullNameAndUsername} from "../../shared/models";
import {TrainerService} from "../../services/trainer.service";

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit{
  public hours = [10, 11, 12, 13, 14, 15, 16, 17, 18]
  public day: number;
  public month: number;
  public year: number;
  public selectedDate: string;

  public trainerInfo: TrainerFullNameAndUsername = {} as TrainerFullNameAndUsername;
  public trainerFullInfo: Trainer;

  public areReservationsLoading: boolean = true;

  constructor(private reservationService: ReservationService, private route: ActivatedRoute, private router: Router, private trainerService: TrainerService){}
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

  private loadTrainerReservation() {
    this.reservationService.getTrainerReservationsByYearAndMonthAndDay(this.trainerInfo.username, this.year, this.month, this.day).subscribe(reservations => {
      console.log(reservations);
      //TODO: sync reservations with the ones that come from backend
    });
  }

  private loadTrainer() {
    this.trainerService.getTrainerFullInfo(this.trainerInfo.username).subscribe(data => {
      this.trainerFullInfo = data;
      this.loadTrainerReservation();
    })
  }
}
