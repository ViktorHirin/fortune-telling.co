import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeoConfigComponent} from './page/seo-config.component'

const routes: Routes = [
  {
		path:'',
		component:SeoConfigComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeoConfigRoutingModule { }
