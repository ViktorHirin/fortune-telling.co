import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayoutsComponent} from './page/payouts.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { PayoutsRoutingModule} from './payouts.routing.module';
import { PayoutsDetailComponent } from './page/payouts-detail/payouts-detail.component'
@NgModule({
  declarations: [
    PayoutsComponent,
    PayoutsDetailComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    PayoutsRoutingModule
  ]
})
export class PayoutsModule { }
