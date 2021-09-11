import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoConfigComponent } from './page/seo-config.component';
import {SeoConfigRoutingModule} from './seo-config-routing.module';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';

@NgModule({
  declarations: [SeoConfigComponent],
  imports: [
    CommonModule,
    PipeModule,
    SeoConfigRoutingModule,
    SharedModule,
    ImportsMaterialModule,
	  FormsModule,
    ReactiveFormsModule,
  ]
})
export class SeoConfigModule { }
