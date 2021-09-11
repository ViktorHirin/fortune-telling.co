import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { StaticPageComponent } from './static-page.component';
import { ManagerStaticPageComponent} from './manager-static-page/manager-static-page.component';
const routes: Routes = [{
  path: '',
  component: ManagerStaticPageComponent,
  },
  {
    path:'edit/:id',
    component:StaticPageComponent
  },
  {
    path:'new',
    component:StaticPageComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPageRoutingModule{}
