import {Component, Inject ,OnInit ,ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl,FormGroup, FormGroupDirective, NgForm, Validators, FormBuilder,ValidationErrors} from '@angular/forms';
import {AlertService} from '@/_servies/alert.service';
import { User} from '@/_models';
import {ErrorStateMatcher} from '@angular/material/core';
import { environment} from 'environments/environment';
import { HttpClient} from '@angular/common/http';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
export interface DialogNewUser {
  role: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
   // const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl );
  }
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  public registerForm: FormGroup;
  loading = false;
  submitted = false;
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  matcher = new MyErrorStateMatcher();
  user:User=new User();
  constructor(private httpClient:HttpClient, public dialogRef: MatDialogRef<AddUserComponent>,private alertService:AlertService,
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogNewUser) {
     if(this.data.role=="clairvoyant")
     {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.email,Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        prePassword: ['', [Validators.required, Validators.minLength(6)]],
        phoneFormControl:['',[Validators.required]]
       }, { validator: this.checkPasswords });
     }
     else
     {
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.email,Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        prePassword: ['', [Validators.required, Validators.minLength(6)]],
      //  phoneFormControl:['',[Validators.required]]
    }, { validator: this.checkPasswords });
     }
    
   }

   ngOnInit() {
    
}

// convenience getter for easy access to form fields
public get f() { return this.registerForm.controls; }
  onSubmit(){
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.loading=true;
    this.user.role=this.data.role;
    this.httpClient.put<any>(`${environment.apiUrl}/api/v1/user/register`,this.user)
                    .subscribe(data => {
                      this.alertService.success('Successfully');
                      this.dialogRef.close({status:true});
                    },
                    error=>{
                      this.alertService.error(error);
                      this.dialogRef.close({status:false});
                    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  checkPasswords (group: FormGroup) { // here we have the 'passwords' group
  let pass = group.get('password').value;
  let confirmPass = group.get('prePassword').value;

  return pass === confirmPass ? null : { notSame: true }
}

}
