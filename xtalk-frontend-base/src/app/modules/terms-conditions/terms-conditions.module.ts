import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsConditionsComponent} from './page/terms-conditions.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { TermsConditionsRoutingModule} from './terms-conditions-routing.module'
@NgModule({
  declarations: [
  	TermsConditionsComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    TermsConditionsRoutingModule
  ]
})
export class TermsConditionsModule { }
