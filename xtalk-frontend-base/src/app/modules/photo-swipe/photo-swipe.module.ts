import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoSwipeComponent } from './photo-swipe/photo-swipe.component';
@NgModule({
	entryComponents:[PhotoSwipeComponent],
  declarations: [PhotoSwipeComponent],
  imports: [
    CommonModule
  ],
  exports:[
  PhotoSwipeComponent
  ]
})
export class PhotoSwipeModule { }
