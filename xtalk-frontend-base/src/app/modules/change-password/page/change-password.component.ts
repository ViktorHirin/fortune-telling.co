import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
import { User } from '@/_models/';
import { AlertService, } from '@/_servies';
import { AuthenticationService } from '@/_servies/authentication.service';
import { UserService } from '@/_servies/user.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordFormGroup: FormGroup;
  user: User;
  matcher = new MyErrorStateMatcher();
  constructor(private authenService: AuthenticationService,
    private userService: UserService,
    private alterService: AlertService,
    private formBuilder: FormBuilder) {
    this.user = this.authenService.currentUserValue;
    this.passwordFormGroup = this.formBuilder.group({
      oldPasswordCtrl: ['', Validators.required],
      passwordCtrl: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.passwordFormGroup.invalid) {
      return;
    }
    var user = {
      id: this.user.id,
      oldPassword: this.passwordFormGroup.controls.oldPasswordCtrl.value,
      password: this.passwordFormGroup.controls.passwordCtrl.value,
    }
    this.userService.changePasswordasUser(user).subscribe(data => {
      this.alterService.success('Password changed successfully');
    },
      error => {
        this.alterService.error('Errors');
      });
  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('passwordCtrl').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true }
  }



}
