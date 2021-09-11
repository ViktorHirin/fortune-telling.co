import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AlertService } from '@/_servies/alert.service';
import { UserService } from '@/_servies/user.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { environment } from 'environments/environment';
import { Router } from "@angular/router"
import { HttpClient } from '@angular/common/http';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    return (invalidCtrl);
  }
}
@Component({
  selector: 'app-register-model',
  templateUrl: './register-model.component.html',
  styleUrls: ['./register-model.component.css']
})
export class RegisterModelComponent implements OnInit {
  infoFormGroup: FormGroup;
  phone: any;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  maxLengthText: number = environment.maxLenghtText;
  maxPhoneLength: number = environment.maxLenghtPhone;
  fileFormGroup: FormGroup;
  registerFormGroup: FormGroup;
  user: any = {};
  isEditable = false;
  loading: boolean = false;
  fileData: File = null;
  matcher = new MyErrorStateMatcher();

  constructor(private alertService: AlertService, private _formBuilder: FormBuilder, private httpClient: HttpClient
    , private router: Router, private authenticationService: AuthenticationService, private userService: UserService) {
    this.infoFormGroup = this._formBuilder.group({
      rolesCtrl: ['', [Validators.required, Validators.maxLength(this.maxLengthText)]],
      interestsCtrl: ['', [Validators.required, Validators.maxLength(this.maxLengthText)]],
      specialitiesCtrl: ['', [Validators.required, Validators.maxLength(this.maxLengthText)]]
    });

  }

  ngOnInit() {
    this.user.firstName = '',
      this.user.lastName = '',
      this.user.email = '',
      this.user.phone = {
        countryCode: "US",
        dialCode: "+1",
        e164Number: "+112345789",
        internationalNumber: "+1 12345789",
        nationalNumber: "12345789",
        number: "12345789",
      }
    this.user.password = '',
      this.user.about = '',
      this.user.interests = '',
      this.user.specialities = '',
      this.user.category = '',


      this.fileFormGroup = this._formBuilder.group({
        audioCtrl: ['', Validators.required, this.checkFileSize()]
      });

    this.registerFormGroup = this._formBuilder.group({
      firstNameCtrl: ['', [Validators.required, Validators.maxLength(255)]],
      lastNameCtrl: ['', [Validators.required, Validators.maxLength(255)]],
      emailCtrl: ['', [Validators.required, Validators.email]],
      phoneNumberCtrl: ['', [Validators.maxLength(this.maxPhoneLength), Validators.required]],
      passwordCtrl: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.checkPasswords });
  }


  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  //submit form 
  onSubmit() {
    this.loading = true;
    if (!this.checkFileSize && this.fileFormGroup.invalid && this.registerFormGroup.invalid && this.infoFormGroup.invalid) {
      return
    }
    if (this.loading) {
      this.user.phone = this.registerFormGroup.get('phoneNumberCtrl').value;
      this.userService.registerModel(this.fileData, this.user)
        .subscribe(data => {
          if (data.status == true) {
            this.loading = false;
            this.alertService.success('Please check email confirmation to activate your account', true, false);
            this.router.navigate(['/login']);
          }
          else {
            this.loading = false;
            this.alertService.error(data.msg);
            this.loading = false;
          }
        },
          error => {
            this.alertService.error(error.msg);
            this.loading = false;
          });
    }

  }
  //validator form to check same password 
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('passwordCtrl').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  // check file size 
  public get infoForm() {
    return this.infoFormGroup.controls;
  }
  checkFileSize(): boolean {
    if (this.fileData == null) {
      return false;
    }
    if (this.fileData.size > environment.maxAudioFileSize) {
      this.fileFormGroup.controls['fileData'].setValue(null);
    }
    else {
      return true;
    }
  }


}
