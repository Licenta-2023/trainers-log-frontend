import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Reservation} from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  getTrainerReservationsByMonth(username: string, year: number, month: number) {
    return this.http.get<Reservation[]>(environment.url + `api/reservation/trainers/${username}/years/${year}/months/${month}`);
  }
}
