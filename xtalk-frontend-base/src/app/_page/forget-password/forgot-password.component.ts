import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService} from '@/_servies/user.service';
import {AlertService} from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
 RequestResetForm: FormGroup;
 forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;
  constructor(
    private userService: UserService,
    private router: Router,
	private alertifyService:AlertService,
	private authenticationService:AuthenticationService
   ) {

  }

  ngOnInit(): void {
	  
	 this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }
  
  
  RequestResetUser(form) {
    if (form.valid) {
      this.IsvalidForm = true;
      this.authenticationService.forgotPassword(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.alertifyService.success("Reset password link send to email sucessfully.");
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/login']);
          }, 3000);
        },
        err => {

          if (err.error) {
            this.errorMessage = err.error;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }
}
