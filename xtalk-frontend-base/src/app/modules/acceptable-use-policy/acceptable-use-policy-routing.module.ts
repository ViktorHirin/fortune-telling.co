import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcceptableUsePolicyComponent} from './page/acceptable-use-policy.component';

const routes: Routes = [
  {
    path:'',
    component:AcceptableUsePolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcceptableUsePolicyRoutingModule { }
