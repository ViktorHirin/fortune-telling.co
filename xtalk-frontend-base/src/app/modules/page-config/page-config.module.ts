import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageConfigRoutingModule } from './page-config-routing.module';
import {PageConfigComponent} from './page/page-config.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';

@NgModule({
  declarations: [
  	PageConfigComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PageConfigRoutingModule
  ]
})

export class PageConfigModule { }
