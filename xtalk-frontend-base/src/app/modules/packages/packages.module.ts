import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagesComponent} from './page/packages.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { PackagesRoutingModule} from './packages-routing.module'
@NgModule({
  declarations: [
  	PackagesComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    PackagesRoutingModule
  ]
})
export class PackagesModule { }
