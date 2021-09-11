import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterModelComponent} from './page/register-model.component' 

const routes: Routes = [{
  path: '',
  component: RegisterModelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterModelRoutingModule { }
