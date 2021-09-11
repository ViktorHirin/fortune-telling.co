import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerUserComponent} from './page/manager-user.component';
const routes: Routes = [
  {
    path:'',
    component:ManagerUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerUserRoutingModule { }
