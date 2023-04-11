import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy{
  isMenuCollapsed: boolean = true;
  loggedUserSubscription: Subscription
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    this.loggedUserSubscription = this.authService.loggedUserData.subscribe(userData => {
      this.isLogged = !!userData;
    });
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.loggedUserSubscription.unsubscribe();
  }

  isAdminLogged() {
    return this.authService.isAdminLogged();
  }
}
