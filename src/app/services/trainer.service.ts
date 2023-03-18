import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Trainer, TrainerFullNameAndUsername} from "../shared/models";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  constructor(private http: HttpClient) {}

  getTrainersFullnameAndUsername() {
    return this.http.get<TrainerFullNameAndUsername[]>(environment.url + 'api/trainer/usernames');
  }

  getTrainerFullInfo(username: string) {
    return this.http.get<Trainer>(environment.url + `api/trainer/${username}`);
  }

  getMaxReservationSlotsForTrainer(trainer: Trainer): number {
    const startHour = +trainer.startOfDay.split(':')[0];
    const endHour = +trainer.endOfDay.split(':')[0];
    const totalHours = endHour - startHour;
    return totalHours * trainer.totalClientsPerReservation;
  }
}
