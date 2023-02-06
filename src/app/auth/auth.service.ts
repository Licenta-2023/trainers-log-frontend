import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LoginUser, RegisterUser, UserData} from "../shared/models";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedUserData = new BehaviorSubject<UserData>(null);

  constructor(private http: HttpClient) {
  }


  logIn(loginData: LoginUser) {
    return this.http.post<UserData>(environment.url + 'api/user/login', loginData);
  }

  register(registerData: RegisterUser) {
    return this.http.post(environment.url + 'api/user/register', registerData);
  }

  autoLogin() {
    const loggedUserData = this.loadUserFromLocalStorage();
    if (loggedUserData) {
      this.loggedUserData.next(loggedUserData);
    }
  }

  storeUserToLocalStorage(user: UserData) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  loadUserFromLocalStorage() {
    const loggedUserData: UserData = JSON.parse(localStorage.getItem('userData'));
    return loggedUserData;
  }

  clearUserFromLocalStorage() {
    localStorage.removeItem('userData');
  }

  logOut() {
    this.clearUserFromLocalStorage();
    this.loggedUserData.next(null);
  }
}
