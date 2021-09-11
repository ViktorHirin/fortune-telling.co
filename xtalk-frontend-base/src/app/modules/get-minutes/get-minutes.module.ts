import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetMinutesComponent} from './page/get-minutes.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { GetMinutesRoutingModule} from './get-minutes-routing.module'
@NgModule({
  declarations: [
  	GetMinutesComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    GetMinutesRoutingModule
  ]
})
export class GetMinutesModule { }
