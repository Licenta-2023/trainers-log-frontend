import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy{
  users = [];
  getUsersSubscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.getUsersSubscription = this.userService.getUsers().subscribe((users: any[]) => {
      console.log(users);
      this.users = users;
    })
  }

  ngOnDestroy() {
    this.getUsersSubscription.unsubscribe();
  }
}
