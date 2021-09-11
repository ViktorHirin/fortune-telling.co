import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseResetPasswordComponent } from './response-reset-password/response-reset-password.component';
import { ResponseResetPasswordRoutingModule } from './response-reset-password-routing.module';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';

@NgModule({
  declarations: [ResponseResetPasswordComponent],
  imports: [
    CommonModule,
	ReactiveFormsModule,
	FormsModule,
	ResponseResetPasswordRoutingModule,
  SharedModule,
  ]
})
export class ResponseResetPasswordModule { }
