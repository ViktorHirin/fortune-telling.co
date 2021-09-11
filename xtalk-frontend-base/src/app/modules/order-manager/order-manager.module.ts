import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderManagerComponent} from './page/order-manager.component';
import {ImportsMaterialModule, SharedModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { OrderManagerRoutingModule} from './order-manager-routing.module'
@NgModule({
  declarations: [
  	OrderManagerComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    OrderManagerRoutingModule
  ]
})
export class OrderManagerModule { }
