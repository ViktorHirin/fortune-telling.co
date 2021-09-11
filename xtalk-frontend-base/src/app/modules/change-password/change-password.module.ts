import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import {ChangePasswordComponent} from './page/change-password.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
  	ChangePasswordComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChangePasswordRoutingModule
  ]
})
export class ChangePasswordModule { }
