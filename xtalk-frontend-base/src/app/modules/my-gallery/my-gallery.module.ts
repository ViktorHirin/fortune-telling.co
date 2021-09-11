import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyGalleryComponent} from './page/my-gallery.component';
import { SharedModule,ImportsMaterialModule } from '@/shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MyGalleryRoutingModule} from './my-gallery-routing.module';
import {} from '@angular/router'
@NgModule({
  declarations: [
    MyGalleryComponent,

  ],
  imports: [
    NgbModule,
    CommonModule,
    ImportsMaterialModule,
    SharedModule,
    MyGalleryRoutingModule
    
  ]
})
export class MyGalleryModule { }
