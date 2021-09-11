import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ManagerWithdrawComponent
} from './page/manager-withdraw.component';
const routes: Routes = [
  {
    path:'',
    component:ManagerWithdrawComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerWithdrawRoutingModule { }
