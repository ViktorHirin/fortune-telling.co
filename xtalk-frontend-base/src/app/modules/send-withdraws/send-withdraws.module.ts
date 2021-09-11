import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendWithdrawsComponent } from './page/send-withdraws.component';
import {SendWithdrawsRoutingModule} from './send-withdraws-routing.module';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';;
@NgModule({
  declarations: [
  	SendWithdrawsComponent
  ],
  imports: [
    ImportsMaterialModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SendWithdrawsRoutingModule
  ]
})

export class SendWithdrawsModule { }
