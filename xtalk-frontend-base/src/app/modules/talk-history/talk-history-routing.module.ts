import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TalkHistoryComponent } from './page/talk-history.component';
const routes: Routes = [
  {
    path:'',
    component:TalkHistoryComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalkHistoryRoutingModule { }
