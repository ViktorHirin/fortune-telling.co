import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagesComponent } from './page/packages.component';

const routes: Routes = [
	{
		path: '',
		component: PackagesComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PackagesRoutingModule { }
