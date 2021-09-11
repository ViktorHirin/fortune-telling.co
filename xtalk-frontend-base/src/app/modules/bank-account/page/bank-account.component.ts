import { Component, OnInit } from '@angular/core';
import { AlertService } from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import {BankService} from '@/_servies/bank.service';
import { User, Bank } from '@/_models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {
  bankInfo: Bank;
  countries: any[] = [];
  bankFormGroup: FormGroup;
  user: User;
  country = 'US';
  constructor(private bankService: BankService, private alertService: AlertService,
    private formBuilder: FormBuilder,
    private authenticated: AuthenticationService) {
    this.bankInfo = new Bank();
    this.user = this.authenticated.currentUserValue;
    this.bankInfo = this.bankService.currentBankInfoValue;
    this.bankService.currentBankInfo.subscribe(data => {
      this.bankInfo = data;
    },
      err => {
        this.alertService.error(err['data'].msg);
      });
  }

  ngOnInit() {
    this.bankFormGroup = this.formBuilder.group({
      accountNoControl: ['', [Validators.required, Validators.maxLength(50)]],
      bankControl: ['', [Validators.required, Validators.maxLength(250)]],
      nameFormControl: ['', [Validators.required, Validators.maxLength(250)]],
      routingFormControl: ['', [Validators.required, Validators.maxLength(250)]],
      swiftFormControl: ['', [Validators.required, Validators.maxLength(250)]],

    });
    this.bankService.getBankInfo();
    // this.bankService.getListCountry().subscribe(data=>{
    //   this.countries=data['data'];
    // },err=>{
    //   this.alertService.error("Can't not get list country");
    // })

  }

  public get f() {
    return this.bankFormGroup.controls;
  }

  onSubmit() {
    this.bankInfo.userId = this.user.id;
    //this.bankInfo.country=this.country;
    this.bankService.updateBankInfo(this.bankInfo).subscribe(data => {
      this.alertService.success("Update Successful", false, true);
    },
      error => {
        this.alertService.error("Update Failed", false, true);
      });
  }

  selectedCountry(e) {
    this.bankInfo.country = e.target.value;
  }

}
