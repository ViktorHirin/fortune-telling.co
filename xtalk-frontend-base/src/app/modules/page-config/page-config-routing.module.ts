import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageConfigComponent} from './page/page-config.component'

const routes: Routes = [
  {
    path:'',
    component:PageConfigComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageConfigRoutingModule { }
