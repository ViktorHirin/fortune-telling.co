import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordKeepingComplianceComponent} from './page/record-keeping-compliance.component';

const routes: Routes = [
  {
    path:'',
    component:RecordKeepingComplianceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordKeepingComplianceRoutingModule { }
