import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ForgotPasswordComponent } from './forgot-password.component';
import {MatInputModule} from '@angular/material/input';
import {
  MatButtonModule,
 
} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { SharedModule} from '@/shared/shared.module';
const routes: Routes = [
  { path: '', component: ForgotPasswordComponent },
];

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class ForgetPasswordModule { }
