import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/models";
import {UserService} from "../../services/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  users: User[];
  displayedColumns = ['username', 'firstName', 'lastName', 'dob', 'roles', 'edit', 'delete'];
  userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private userService: UserService) {

  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.userDataSource.paginator = this.paginator;
    this.userDataSource.sort = this.sort;
  }

  private loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = [];
      this.users.push(...users);
      this.userDataSource.data = this.users;
    });
  }

  applyFilter(filterEvent: any) {
    this.userDataSource.filter = filterEvent.value.trim().toLowerCase(); // Datasource defaults to lowercase matches

    if (this.userDataSource.paginator) {
      this.userDataSource.paginator.firstPage();
    }
  }

  onClick(element: User) {
    console.log(element);
  }
}
