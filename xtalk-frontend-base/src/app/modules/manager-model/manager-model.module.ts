import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerModelComponent} from './page/manager-model.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { ManagerModelRoutingModule} from './manager-model-routing.module'
@NgModule({
  declarations: [
  	ManagerModelComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ManagerModelRoutingModule
  ]
})
export class ManagerModelModule { }
