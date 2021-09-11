import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdsManagerComponent} from './page/ads-manager.component';
const routes: Routes = [
  {
    path:'',
    component:AdsManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdsManagerRoutingModule { }
