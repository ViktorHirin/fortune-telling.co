import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SafePipe,SearchableRoomPipe,SearchableListPipe} from '@/_pipe';



@NgModule({
  declarations: [
    SafePipe,
    SearchableListPipe,
    SearchableRoomPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SafePipe,
    SearchableListPipe,
    SearchableRoomPipe
  ]
})
export class PipeModule { }
