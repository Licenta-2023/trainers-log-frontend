import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import * as moment from "moment/moment";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;

  isFormDisabled: boolean = true;
  private initialState: object;

  constructor(private authService: AuthService, private userService: UserService) { }

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
    });
    this.userService.getLoggedUser().subscribe(user => {
      this.profileForm.setValue({
        email: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        dob: moment(user.dob, "DD-MM-YYYY").format("YYYY-MM-DD")
      });
      this.profileForm.disable();
      this.initialState = this.profileForm.value;
    })
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
}
