import { Component, OnInit ,OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import {CallService} from '@/_servies/call.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private callService:CallService
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required,Validators.email]],
            password: ['', Validators.required]
        });
        this.route.queryParams.subscribe(params => {
            if (params['returnUrl']) {
              this.returnUrl=params['returnUrl'];
            }
            
          });
        this.alertService.clear();
    }

    ngOnInit() {
         // redirect to home if already logged in
        if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.access_token) {
            this.router.navigate(['/']);
        }
        // get return url from route parameters or default to '/'

        var bodyEle=document.getElementsByTagName('body')[0];
        //bodyEle.scrollIntoView();
        }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    if(data && data.status == true){
                        this.callService.reloadTwilio();
                        this.returnUrl=this.returnUrl?this.returnUrl:'/';
                        this.router.navigate([this.returnUrl]);                        
                    }
                    else
                    {
                        this.alertService.error(data.msg);    
                    }      
                    this.loading = false;  
                },
                error => {

                    this.alertService.error('Invalid email or Password',false);
                    this.loading = false;
                }
                );
    }
}
