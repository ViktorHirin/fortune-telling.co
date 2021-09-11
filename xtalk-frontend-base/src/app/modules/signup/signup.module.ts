import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './page/signup.component';
import {SignupRoutingModule} from './signup-routing.module';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'
@NgModule({
  declarations: [
  	SignupComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    NgxIntlTelInputModule,
    NgxCaptchaModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SignupRoutingModule
  ]
})

export class SignupModule { }
