import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {UserService} from "../../services/user.service";
import * as moment from "moment";
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserRoles} from "../../shared/models";
import {TrainerService} from "../../services/trainer.service";

@Component({
  selector: 'app-admin-edit-user',
  templateUrl: './admin-edit-user.component.html',
  styleUrls: ['./admin-edit-user.component.css']
})
export class AdminEditUserComponent implements OnInit{

  profileForm: FormGroup;
  user: User;
  usernameToEdit: string;

  userRolesControl = new FormControl<UserRoles[]>([], Validators.required);
  roles: string[] = Object.keys(UserRoles);
  public isTrainer: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private trainerService: TrainerService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.usernameToEdit = params.username;
      this.initForm();
    });
  }

  private initForm() {
    this.profileForm = new FormGroup<any>({
      email: new FormControl({value: null, disabled: true}),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      startOfDay: new FormControl(null),
      endOfDay: new FormControl(null),
      totalClientsPerReservation: new FormControl(null),
    });
    this.isTrainer = this.roles.includes(UserRoles.TRAINER);
    if(this.isTrainer) {
      this.loadProfileForTrainer();
    } else {
      this.loadProfileForUser();
    }
  }

  onSubmit() {
    this.userService.patchUser(this.usernameToEdit, {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      dob: moment(this.profileForm.value.dob, "YYYY-MM-DD").format("DD-MM-YYYY"),
      newRoles: this.userRolesControl.value,
      ...(this.isTrainer && { patchTrainerBody: {
          startOfDay: moment(this.profileForm.value.startOfDay, 'hh:mm').format('hh:00:00'),
          endOfDay: moment(this.profileForm.value.endOfDay, 'HH:mm').format('HH:00:00'),
          totalClientsPerReservation: this.profileForm.value.totalClientsPerReservation
        }}),
    }).subscribe(() => {
      this.initForm();
    });
  }

  cancelEdit() {
    this.router.navigate(['/admin']);
  }

  onRoleRemove(role: string) {
    const roles = this.userRolesControl.value;
    this.removeFirst(roles, role);
    this.userRolesControl.setValue(roles);
    this.userRolesControl.markAsDirty();
  }

  private removeFirst(array: string[], toRemove: string): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  private loadRolesForUser() {
    this.userRolesControl.setValue(this.user.roles);
  }

  private loadProfileForTrainer() {
    this.trainerService.getTrainerFullInfo(this.usernameToEdit).subscribe(trainer => {
      this.user = trainer.user;
      this.profileForm.setValue({
        email: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        dob: moment(this.user.dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
        startOfDay: trainer.startOfDay,
        endOfDay: trainer.endOfDay,
        totalClientsPerReservation: trainer.totalClientsPerReservation,
      });
      this.loadRolesForUser();
    });
  }

  private loadProfileForUser() {
    this.userService.getUser(this.usernameToEdit).subscribe(user => {
      this.user = user;
      this.profileForm.setValue({
        email: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        dob: moment(this.user.dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
        startOfDay: null,
        endOfDay: null,
        totalClientsPerReservation: 0,
      });
      this.loadRolesForUser();
    });
  }
}
