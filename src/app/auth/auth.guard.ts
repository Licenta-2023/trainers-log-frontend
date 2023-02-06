import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, take} from 'rxjs';
import {AuthService} from "./auth.service";
import {UserData} from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.loggedUserData.pipe(
      take(1),
      map((loggedUserData: UserData) => {
        const isAuth = !!loggedUserData;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/log-in']);
      })
    )
  }

}
