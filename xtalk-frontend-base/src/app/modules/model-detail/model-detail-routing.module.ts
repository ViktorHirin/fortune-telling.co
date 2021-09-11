import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelDetailComponent} from './page/model-detail.component';

const routes: Routes = [
  {
    path:'',
    component:ModelDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelDetailRoutingModule { }
