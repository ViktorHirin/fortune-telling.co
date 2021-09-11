import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReivewManagerComponent} from './page/reivew-manager.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { ReivewManagerRoutingModule} from './reivew-manage-routing.module'
@NgModule({
  declarations: [
  	ReivewManagerComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReivewManagerRoutingModule
  ]
})

export class ReivewManager { }
