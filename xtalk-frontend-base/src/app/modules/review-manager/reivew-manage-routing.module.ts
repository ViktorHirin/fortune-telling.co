import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReivewManagerComponent} from './page/reivew-manager.component';
const routes: Routes = [
  {
    path:'',
    component:ReivewManagerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReivewManagerRoutingModule { }
