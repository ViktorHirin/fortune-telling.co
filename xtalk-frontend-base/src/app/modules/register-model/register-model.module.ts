import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterModelComponent} from './page/register-model.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { RegisterModelRoutingModule} from './register-model-routing.module'
@NgModule({
  declarations: [
  	RegisterModelComponent
  ],
  imports: [
    ImportsMaterialModule,
    PipeModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    FormsModule,
    RegisterModelRoutingModule
  ]
})
export class RegisterModelModule { }
