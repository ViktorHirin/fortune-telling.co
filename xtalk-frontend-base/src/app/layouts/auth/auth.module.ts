import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@/shared/shared.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
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
   MatSelectModule,
   MatOptionModule
  } from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthComponent} from './auth.component';


@NgModule({
  declarations: [
  AuthComponent,
],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule ,
    MatDialogModule,
    MatButtonModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule
    ],
  providers: [
  ]
})

export class AuthModule { }
