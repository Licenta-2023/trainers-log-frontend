import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Reservation, ReservationType} from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  getTrainerReservationsByYearAndMonth(username: string, year: number, month: number) {
    return this.http.get<Reservation[]>(environment.url + `api/reservation/trainers/${username}/years/${year}/months/${month}`);
  }

  getTrainerReservationsByYearAndMonthAndDay(username: string, year: number, month: number, day: number) {
    return this.http.get<Reservation[]>(environment.url + `api/reservation/trainers/${username}/years/${year}/months/${month}/days/${day}`);
  }

  getUserReservationsByYearAndMonthAndDay(username: string, year: number, month: number, day: number) {
    return this.http.get<Reservation[]>(environment.url + `api/reservation/users/${username}/years/${year}/months/${month}/days/${day}`);
  }

  makeReservation(username: string, trainerUsername: string, timeIntervalBegin: string, reservationType: ReservationType) {
    return this.http.post(environment.url + 'api/reservation', {
      username,
      trainerUsername,
      timeIntervalBegin,
      reservationType
    });
  }

  deleteReservation(username: string, trainerUsername: string, timeIntervalBegin: string, reservationType: ReservationType) {
    const body = {
      username,
      trainerUsername,
      timeIntervalBegin,
      reservationType
    };
    return this.http.delete(environment.url + 'api/reservation', {
      body
    });
  }
}
