import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from 'environments/environment'
import { UserService } from '@/_servies/user.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { AlertService } from '@/_servies/alert.service';
import { ModalService } from '@/_modal';
import { ReCaptcha2Component } from 'ngx-captcha';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    passwordMinLength = environment.minLengthPass;
    siteKey = environment.reCaptchaSiteKey;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private modalService: ModalService,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.access_token) {
            this.router.navigate(['/']);
        }

    }

    public captchaIsLoaded = false;
    public captchaSuccess = false;
    public captchaIsExpired = false;
    public captchaResponse?: string;

    public theme: 'light' | 'dark' = 'light';
    public size: 'compact' | 'normal' = 'normal';
    public lang = 'en';
    public type: 'image' | 'audio';

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
            prePassword: ['', [Validators.required]],
            recaptcha: ['', Validators.required]
        }, { validator: this.checkPasswords });
    }

    // convenience getter for easy access to form fields
    public get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status == '200') {
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
                    this.loading = false;
                    this.alertService.error(error.message);
                    this.loading = false;
                });
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.get('password').value;
        let confirmPass = group.get('prePassword').value;

        return pass === confirmPass ? null : { notSame: true }
    }

    openContact() {
        this.modalService.open('ticket-modal');
    }

    handleSuccess(e) {
    }

}

