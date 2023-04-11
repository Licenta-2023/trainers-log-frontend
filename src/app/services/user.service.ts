import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";
import {PatchUserRequestBody, User} from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers() {
    return this.http.get<User[]>(environment.url + 'api/user');
  }

  getUser(username: string) {
    return this.http.get<User>(environment.url + `api/user/${username}`);
  }

  getLoggedUser() {
    const loggedUsername = this.authService.getLoggedUsername();
    return this.getUser(loggedUsername);
  }

  patchUser(username: string, patchUserRequestBody: PatchUserRequestBody) {
    return this.http.patch(environment.url + `api/user/${username}`, patchUserRequestBody);
  }
}
