import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetMinutesComponent} from './page/get-minutes.component';

const routes: Routes = [
  {
    path:'',
    component:GetMinutesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetMinutesRoutingModule { }
