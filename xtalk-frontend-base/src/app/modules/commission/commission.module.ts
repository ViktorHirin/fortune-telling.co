import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionComponent} from './page/commission.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { CommissionRoutingModule} from './commission-routing.module'
@NgModule({
  declarations: [
  	CommissionComponent
  ],
  imports: [
    ImportsMaterialModule,
    ReactiveFormsModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    CommissionRoutingModule
  ]
})


export class CommissionModule { }
