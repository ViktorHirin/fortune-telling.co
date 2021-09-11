import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageComponent } from './page/page.component';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module'

@NgModule({
  declarations: [PageComponent],
  imports: [
    SharedModule,
    ImportsMaterialModule,
    CommonModule,
    PageRoutingModule
  ]
})
export class PageModule { }
