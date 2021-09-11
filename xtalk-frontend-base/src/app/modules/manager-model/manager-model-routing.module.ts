import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerModelComponent} from './page/manager-model.component';
const routes: Routes = [
  {
    path:'',
    component:ManagerModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerModelRoutingModule { }
