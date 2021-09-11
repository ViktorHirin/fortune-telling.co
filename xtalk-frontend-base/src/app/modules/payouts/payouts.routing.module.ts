import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayoutsComponent } from './page/payouts.component';
import { PayoutsDetailComponent } from './page/payouts-detail/payouts-detail.component'
const routes: Routes = [
  {
    path:'',
    component:PayoutsComponent
  },
  {
	path: 'payout-detail/:id',
	component: PayoutsDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayoutsRoutingModule{}
