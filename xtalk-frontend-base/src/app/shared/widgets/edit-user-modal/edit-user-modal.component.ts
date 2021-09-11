import { Component, Inject, OnInit, ElementRef, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '@/_servies/user.service';
import { AlertService } from '@/_servies/alert.service';
import { ModelService } from '@/_servies/model.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { environment } from 'environments/environment';
import { User } from '@/_models';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { ImageHelper } from '@/_helpers/image';
import { ImageCroppedEvent } from 'ngx-image-cropper';
export interface DialogUser {
  title: string;
  id: string;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css']
})
export class EditUserModalComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  separateDialCode = true;
  imageHelper: ImageHelper = new ImageHelper();
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  genders: any;
  gender: String;
  newAudioUrl: any;
  disableAbout: boolean = true;
  fileFormGroup: FormGroup;
  tokenFormGroup: FormGroup;
  ageFormControl = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(80)
  ]);
  fileData: File = null;
  audioData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  orientationFormControl = new FormControl('', [
    Validators.required,
  ]);
  languagesFormControl = new FormControl('');
  // serviceFormControl = new FormControl('');
  matcher = new MyErrorStateMatcher();
  aboutFormControl = new FormControl('');
  cityFormControl = new FormControl({ disabled: this.disableAbout }, [
    Validators.required,
    Validators.maxLength(500),
  ]);
  specialitiesCtrl = new FormControl('', [
    Validators.required,

  ]);
  interestsCtrl = new FormControl('', [Validators.required]);
  phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(12),
  ]);
  firstNameFormControl = new FormControl('', [
    Validators.required,
  ]);
  lastNameFormControl = new FormControl('', [
    Validators.required,
  ]);
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  constructor(
    private authentication: AuthenticationService, private el: ElementRef,
    private userService: UserService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.genders = [
      { name: 'Man', value: 'man' },
      { name: 'Woman', value: 'woman' },
      { name: 'Other', value: 'other' }
    ];
  }

  fileProgress(fileInput: any, type = 'avatar') {
    if (type == 'avatar') {
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
    if (type == 'audio') {
      this.audioData = <File>fileInput.target.files[0];
      this.previewAudio();
    }

  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.user.avatarUrl = this.previewUrl;
    }
  }

  previewAudio() {
    // Show preview 
    var mimeType = this.audioData.type;
    if (mimeType.match(/audio\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.audioData);
    reader.onload = (_event) => {
      this.newAudioUrl = reader.result;
      this.newAudioUrl.replace('unsafe:', '');


    }
  }

  enableAbout() {
    this.disableAbout = false;
    let aboutController = this.el.nativeElement.querySelectorAll('#editAbout-text');
    (<HTMLInputElement>aboutController[0]).focus();
  }
  ngOnInit() {
    this.fileFormGroup = this.formBuilder.group({
      audioCtrl: ['', Validators.required, this.checkFileSize()]
    });
    this.tokenFormGroup = this.formBuilder.group({
      tokenCtrl: ['', Validators.min(0)]
    });
  }
  onSubmit() {
    const formData = new FormData();
    this.userService.updateProfileasAdmin(this.fileData, this.user)
      .subscribe(data => {
        this.alertService.success('Saved Successfully');
        this.dialogRef.close();
      },
        error => {
          this.alertService.error(error);
          //this.dialogRef.close();
        });
  }

  uploadAudio() {
    this.modelService.updateAudiobyAdmin(this.audioData, this.user.id)
      .subscribe(data => {
        this.alertService.success('Saved Successfully');
        this.user = data.data;
        this.dialogRef.close()
      },
        error => {
          this.alertService.error(error);
        });
  }

  // check file size 

  checkFileSize(): boolean {
    if (this.fileData == null) {
      return false;
    }
    return this.fileData.size > environment.maxAudioFileSize ? false : true;
  }

  public getHTML() {
    return "<audio controls src='" + this.newAudioUrl.replace('unsafe:', '') + "'></audio>";
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
