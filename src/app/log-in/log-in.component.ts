import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.logInForm = new FormGroup<any>({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  submitForm() {
    const loginData: {email: string, password: string} = this.logInForm.value;
    this.authService.logIn({username: loginData.email, password: loginData.password})
      .subscribe({
        next: userData => {
          this.authService.storeUserToLocalStorage(userData);
          this.authService.loggedUserData.next(userData);
          this.logInForm.reset();
          this.router.navigate(['/']);
        },
        error: errorData => {
          const errorClass = errorData.error.error_class;
          if(errorClass) {
            this.errorMessage = errorData.error.error_message;
          } else {
            this.errorMessage = errorData.error;
          }
        }
      });
  }
}
