import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TrainerFullNameAndUsername} from "../shared/models";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  constructor(private http: HttpClient) {}

  getTrainersFullnameAndUsername() {
    return this.http.get<TrainerFullNameAndUsername[]>(environment.url + 'api/trainer/usernames');
  }
}
