import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  getTrainerReservationsByMonth(username: string, month: number) {
    return this.http.get(environment.url + `api/reservation/trainers/${username}/months/${month}`);
  }
}
