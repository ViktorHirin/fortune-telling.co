import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HowToCallComponent} from './page/how-to-call.component';

const routes: Routes = [
  {
    path:'',
    component:HowToCallComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HowToCallRoutingModule { }
