import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordKeepingComplianceComponent} from './page/record-keeping-compliance.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { RecordKeepingComplianceRoutingModule} from './record-keeping-compliance-routing.module'
@NgModule({
  declarations: [
  	RecordKeepingComplianceComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    RecordKeepingComplianceRoutingModule
  ]
})
export class RecordKeepingComplianceModule { }
