import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ResponseResetPasswordComponent } from './response-reset-password/response-reset-password.component';

const routes: Routes = [{
  path: ':token',
  component: ResponseResetPasswordComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseResetPasswordRoutingModule {}
