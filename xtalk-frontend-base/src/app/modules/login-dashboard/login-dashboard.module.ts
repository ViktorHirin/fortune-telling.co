import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginDashboardRoutingModule } from './login-dashboard-routing.module';
import {LoginDashboardComponent} from './page/login-dashboard.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';

@NgModule({
  declarations: [
  	LoginDashboardComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    LoginDashboardRoutingModule
  ]
})

export class LoginDashboardModule { }
