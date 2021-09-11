import { Component, OnInit, ElementRef } from '@angular/core';
import { UserService } from '@/_servies/user.service';
import { AlertService } from '@/_servies/alert.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material';
import { UploadAudioComponent } from '@/shared/widgets/upload-audio/upload-audio.component';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { User } from '@/_models';
import { ImageHelper } from '@/_helpers/image';
import { ImageCroppedEvent } from 'ngx-image-cropper';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  editFullName: Boolean = false;
  imageHelper: ImageHelper = new ImageHelper();
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  loading: boolean = false;
  user: any;
  phone = {
    countryCode: "US",
    dialCode: "+1",
    e164Number: "+112345789",
    internationalNumber: "+1 12345789",
    nationalNumber: "12345789",
    number: "12345789",
  };
  proflieFormGroup: FormGroup;
  maxInputLength: number = 255;
  genders: any;
  gender: String;
  disableAbout: boolean = true;
  ageFormControl = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(80)
  ]);
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  orientationFormControl = new FormControl('', [
    // Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);
  languagesFormControl = new FormControl('', [
    // Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);
  serviceFormControl = new FormControl('');
  matcher = new MyErrorStateMatcher();
  aboutFormControl = new FormControl('', [
    //  Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);
  cityFormControl = new FormControl({ disabled: this.disableAbout }, [
    //  Validators.required,
    Validators.maxLength(500),
  ])
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(15),
  ])
  specialitiesCtrl = new FormControl('', [
    //  Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);
  interestsCtrl = new FormControl('', [
    //  Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);
  fristNameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(this.maxInputLength),
  ]);

  constructor(private authentication: AuthenticationService, private el: ElementRef,
    private userService: UserService, private dialog: MatDialog,
    private alertService: AlertService) {
    this.authentication.currentUser.subscribe(user => {
      if (user) {
        this.user = user;
      }

    });
    this.proflieFormGroup = new FormGroup({}, {});
    this.proflieFormGroup.addControl('ageFormControl', this.ageFormControl);
    this.proflieFormGroup.addControl('orientationFormControl', this.orientationFormControl);
    this.proflieFormGroup.addControl('languagesFormControl', this.languagesFormControl);
    this.proflieFormGroup.addControl('serviceFormControl', this.serviceFormControl);
    this.proflieFormGroup.addControl('aboutFormControl', this.aboutFormControl);
    this.proflieFormGroup.addControl('cityFormControl', this.cityFormControl);
    this.proflieFormGroup.addControl('phoneFormControl', this.phoneFormControl);
    this.proflieFormGroup.addControl('specialitiesCtrl', this.specialitiesCtrl);
    this.proflieFormGroup.addControl('interestsCtrl', this.interestsCtrl);
    this.proflieFormGroup.addControl('fristNameFormControl', this.fristNameFormControl);
    this.proflieFormGroup.addControl('lastNameFormControl', this.lastNameFormControl);
    this.genders = [
      { name: 'Man', value: 'man' },
      { name: 'Woman', value: 'woman' },
      { name: 'Other', value: 'other' }
    ];
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    let isImage = this.imageHelper.isImage(this.fileData);
    if (isImage.valid) {
      //this.preview();
      this.imageChangedEvent = fileInput;
    }
    else {
      this.fileData = null;
      this.alertService.error(isImage.message);
    }
  }
  preview() {
    var reader = new FileReader();

    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.user.avatarUrl = this.previewUrl;
    }
  }
  ngOnInit() {


  }
  enableAbout() {
    this.disableAbout = false;
    let aboutController = this.el.nativeElement.querySelectorAll('#editAbout-text');
    (<HTMLInputElement>aboutController[0]).focus();
  }

  onSubmit() {
    if (!this.proflieFormGroup.invalid) {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.userService.updateProfile(this.fileData, this.user)
      .subscribe((resp:any) => {
        this.user.avatarUrl = resp.data.avatarUrl;
        this.alertService.success('The update was successful', false, true);
        this.authentication.reload();
        this.imageChangedEvent = null;
        this.loading = false;
      },
        error => {
          this.loading = false;
        });
  }

  openUploadAudio() {
    let dialogRef = this.dialog.open(UploadAudioComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data.status) {
        this.user = data.user;
        this.authentication.updateUser(new User().deserialize(data.user));
      }
    })
  }

  changeFullName() {
    this.userService.updateProfile(this.fileData, this.user)
      .subscribe(data => {
        this.alertService.success('The update was successful', false, true);
        this.authentication.reload();
        this.editFullName = false;
      },
        error => {
          this.loading = false;
          this.alertService.error(error);

        });
  }
  editName() {
    this.editFullName = true;
    return;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.fileData = this.imageHelper.base64ToFile(this.croppedImage, this.fileData.name);
  }
  imageLoaded() {

    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }


}
