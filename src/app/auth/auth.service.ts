import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LoginUser, RegisterUser, UserData, UserRoles} from "../shared/models";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import jwtDecode from "jwt-decode";

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

  refreshToken() {
    const refreshToken = this.loggedUserData.getValue().refresh_token;
    return this.http.post<UserData>(environment.url + 'api/user/refreshToken', {}, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${refreshToken}`
      })
    });
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

  getLoggedUsername() {
    const userData = this.loggedUserData.getValue();
    if (userData.access_token) {
      return jwtDecode<{ sub: string }>(userData.access_token).sub;
    }

    return '';
  }

  getLoggedUserRoles() {
    const userData = this.loggedUserData.getValue();

    return jwtDecode<{ roles: string[] }>(userData.access_token).roles;
  }

  isTrainerLogged() {
    return this.getLoggedUserRoles().some(role => role === UserRoles.TRAINER);
  }

  isAdminLogged() {
    return this.getLoggedUserRoles().some(role => role === UserRoles.ADMIN);
  }
}
