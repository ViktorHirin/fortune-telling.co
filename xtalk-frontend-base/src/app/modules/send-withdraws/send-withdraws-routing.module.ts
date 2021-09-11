import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SendWithdrawsComponent
} from './page/send-withdraws.component';
const routes: Routes = [
  {
    path:'',
    component:SendWithdrawsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendWithdrawsRoutingModule { }
