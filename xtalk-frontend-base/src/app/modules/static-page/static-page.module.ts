import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { StaticPageComponent } from './static-page.component';
import { StaticPageRoutingModule } from './static-page-routing.module';
import { ReactiveFormsModule,FormsModule }    from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { SharedModule,ImportsMaterialModule} from '@/shared/shared.module';
import { MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatDialogModule, 
  MatDividerModule, 
  MatCardModule, 
  MatPaginatorModule, 
  MatTableModule ,
  MatCheckboxModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule
 } from '@angular/material';
import { ManagerStaticPageComponent } from './manager-static-page/manager-static-page.component';
import { HttpClient } from '@angular/common/http';
@NgModule({
  declarations: [StaticPageComponent, ManagerStaticPageComponent],
  imports: [
    MatInputModule,
    MatSidenavModule,
    MatDialogModule, 
    MatDividerModule, 
    MatCardModule, 
    MatPaginatorModule, 
    MatTableModule ,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    CKEditorModule,
    CommonModule,
    StaticPageRoutingModule,
	  FormsModule,
    ReactiveFormsModule,
    PipeModule,
    ImportsMaterialModule,
    SharedModule,
  ],
   providers: [
    
  ],
  exports:[
    StaticPageRoutingModule
  ]
})
export class StaticPageModule {}
