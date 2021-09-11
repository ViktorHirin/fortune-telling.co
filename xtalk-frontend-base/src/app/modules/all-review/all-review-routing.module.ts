import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllReviewComponent} from './page/all-review.component';

const routes: Routes = [{
  path:'',
  component:AllReviewComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllReviewRoutingModule { }
