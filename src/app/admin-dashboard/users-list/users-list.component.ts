import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/models";
import {UserService} from "../../services/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";

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
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {

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
    this.userDataSource.filter = filterEvent.value.trim().toLowerCase();

    if (this.userDataSource.paginator) {
      this.userDataSource.paginator.firstPage();
    }
  }

  onDelete(username: string) {
    if(confirm(`Are you sure you want to delete user ${username}?`)) {
      this.userService.deleteUser(username).subscribe(() => {
        this.router.navigate(['./'], {relativeTo: this.route});
      })
    }
  }
}
