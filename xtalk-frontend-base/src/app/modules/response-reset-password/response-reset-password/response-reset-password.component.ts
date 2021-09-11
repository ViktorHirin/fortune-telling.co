import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@/_servies/user.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { AlertService } from '@/_servies/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-response-reset-password',
  templateUrl: './response-reset-password.component.html',
  styleUrls: ['./response-reset-password.component.css']
})
export class ResponseResetPasswordComponent implements OnInit {
  ResponseResetForm: FormGroup;
  passwordMinLength = environment.minLengthPass;
  errorMessage: string;
  successMessage: string;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;
  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private alertifyService: AlertService,
    private fb: FormBuilder) {

    this.CurrentState = 'Wait';
    this.route.params.subscribe(params => {

      this.resetToken = params.token;
      this.VerifyToken();
    });
  }
  ngOnInit() {

    this.Init();
  }

  VerifyToken() {
    this.authenticationService.validPasswordToken({ resettoken: this.resetToken }).subscribe(
      data => {
        this.CurrentState = 'Verified';
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

  Init() {
    this.ResponseResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        newPassword: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
      }
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }


  ResetPassword(form) {
    if (form.valid) {
      this.IsResetFormValid = true;
      this.authenticationService.newPassword(this.ResponseResetForm.value).subscribe(
        (data: any) => {
          this.ResponseResetForm.reset();
          this.alertifyService.success('Change password success fully');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        err => {
          if (err.error) {
            this.errorMessage = err.error;
          }
        }
      );
    } else { this.IsResetFormValid = false; }
  }
}