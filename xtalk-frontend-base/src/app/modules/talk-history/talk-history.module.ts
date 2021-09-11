import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalkHistoryComponent} from './page/talk-history.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { TalkHistoryRoutingModule} from './talk-history-routing.module'
@NgModule({
  declarations: [
  	TalkHistoryComponent
  ],
  imports: [
    NgbModule,
    ImportsMaterialModule,
    PipeModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    FormsModule,
    TalkHistoryRoutingModule
  ]
})

export class TalkHistoryModule { }
