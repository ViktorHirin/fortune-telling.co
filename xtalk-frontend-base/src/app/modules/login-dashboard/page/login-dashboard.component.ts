import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder, Validators} from '@angular/forms';
import { Config} from '@/_models';
import {  AlertService} from '@/_servies/alert.service';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { UserService} from '@/_servies/user.service';

import {LocalstorageService} from '@/_servies/localstorage.service';

import { Router } from '@angular/router';
export interface Login {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login-dashboard',
  templateUrl: './login-dashboard.component.html',
  styleUrls: ['./login-dashboard.component.css']
})

export class LoginDashboardComponent implements OnInit {
  loginForm: FormGroup;
  pageConfig:Config;
  loginData:Login;
  submit() {
    if (this.loginForm.valid) {
      this.authenticationService.loginAsAdmin(this.loginData.email,this.loginData.password).subscribe(data=>{
          localStorage.setItem('admin',JSON.stringify(data.data));
          this.router.navigate(['/dashboard']);
      },
      errors=>{
        this.alertService.error(errors);
      })
    }
  }
  constructor(private localStorage:LocalstorageService ,private alertService:AlertService,private router:Router,private authenticationService:AuthenticationService , private userService:UserService, private _formBuilder:FormBuilder,private pageService:PageconfigService) {
      this.loginData={
        email:'',
        password:''
      };
      this.loginForm=this._formBuilder.group({
        emailCtrl:['',[]],
        passwordCtrl:['',[]]
      })
      this.pageService.currentConfig.subscribe(data=>{
        if(data)
        {
          this.pageConfig=data;
        }
      })
   }

  ngOnInit() {
  }

}
