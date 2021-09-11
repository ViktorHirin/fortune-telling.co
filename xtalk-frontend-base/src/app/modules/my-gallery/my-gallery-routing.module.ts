import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MyGalleryComponent} from './page/my-gallery.component' 

const routes: Routes = [{
  path: '',
  component: MyGalleryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGalleryRoutingModule{}
