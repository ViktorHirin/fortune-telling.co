import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from '@/modules/dashboard/dashboard.component';
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
   MatOptionModule,
   MatOption,
   MatSelectModule
  } from '@angular/material';
import {MatSortModule} from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from '@/modules/dashboard.service';
//import { PaymentSettingsComponent } from '../../modules/payment-settings/payment-settings.component';
import { PageConfigComponent } from '../../modules/page-config/page/page-config.component';
import { ManagerWithdrawComponent } from '../../modules/manager-withdraw/page/manager-withdraw.component';


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
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
    MatOptionModule,
    MatSelectModule
    ],
  providers: [
    DashboardService
  ]
})
export class DefaultModule { }
