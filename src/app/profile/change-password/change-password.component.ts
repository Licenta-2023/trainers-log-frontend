import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{

  changePasswordForm: FormGroup;
  incorrectPassword: boolean = false;
  constructor(private userService: UserService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();
  }
  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.userService.patchUserPassword(this.authService.getLoggedUsername(), {
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword
      }).subscribe({
        next: () => {
          this.router.navigate(['../'], {relativeTo: this.route});
        },
        error: (error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            this.incorrectPassword = true;
          }
        },
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      const newPassword = control.get('newPassword');
      const confirmNewPassword = control.get('confirmNewPassword');
      return newPassword.value !== confirmNewPassword.value ? {badConfirmPassword: { value: confirmNewPassword.value}} : null;
    }
  }

  private initForm() {
    this.changePasswordForm = new FormGroup<any>({
      currentPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmNewPassword: new FormControl(null, [Validators.required]),
    }, this.passwordMatchValidator());
  }
}
