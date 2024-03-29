import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import * as moment from "moment/moment";
import {UserService} from "../services/user.service";
import {TrainerService} from "../services/trainer.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;

  isFormDisabled: boolean = true;
  isTrainer: boolean;
  private initialState: object;

  constructor(private authService: AuthService, private userService: UserService, private trainerService: TrainerService) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.isFormDisabled = true;
    this.profileForm = new FormGroup<any>({
      email: new FormControl({value: null, disabled: true}),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      startOfDay: new FormControl(null),
      endOfDay: new FormControl(null),
      totalClientsPerReservation: new FormControl(null),
    });
    this.isTrainer = this.authService.isTrainerLogged();
    if(this.isTrainer) {
      this.loadProfileForTrainer();
    } else {
      this.loadProfileForUser();
    }
  }

  onSubmit() {
    if (this.isFormDisabled) {
      this.profileForm.enable();
      this.profileForm.get('email').disable();
      this.isFormDisabled = false;
    } else {
      this.userService.patchUser(this.authService.getLoggedUsername(), {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        dob: moment(this.profileForm.value.dob, "YYYY-MM-DD").format("DD-MM-YYYY"),
        newRoles: [],
        ...(this.isTrainer && { patchTrainerBody: {
            startOfDay: moment(this.profileForm.value.startOfDay, 'hh:mm').format('hh:00:00'),
            endOfDay: moment(this.profileForm.value.endOfDay, 'HH:mm').format('HH:00:00'),
            totalClientsPerReservation: this.profileForm.value.totalClientsPerReservation
          }}),
      }).subscribe(() => {
        this.initForm();
      });
    }
  }

  cancelEdit() {
    this.isFormDisabled = true;
    this.profileForm.disable();
    this.revertChanges();
  }

  private revertChanges() {
    this.profileForm.setValue(this.initialState);
  }

  private loadProfileForTrainer() {
    const trainerUsername = this.authService.getLoggedUsername();
    this.trainerService.getTrainerFullInfo(trainerUsername).subscribe(trainer => {
      this.profileForm.setValue({
        email: trainer.user.username,
        firstName: trainer.user.firstName,
        lastName: trainer.user.lastName,
        dob: moment(trainer.user.dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
        startOfDay: trainer.startOfDay,
        endOfDay: trainer.endOfDay,
        totalClientsPerReservation: trainer.totalClientsPerReservation
      });
      this.profileForm.disable();
      this.initialState = this.profileForm.value;
    })
  }

  private loadProfileForUser() {
    this.userService.getLoggedUser().subscribe(user => {
      this.profileForm.setValue({
        email: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: moment(user.dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
        startOfDay: null,
        endOfDay: null,
        totalClientsPerReservation: 0,
      });
      this.profileForm.disable();
      this.initialState = this.profileForm.value;
    });
  }
}
