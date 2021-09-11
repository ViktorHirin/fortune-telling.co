import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PipeModule} from '@/_pipe/pipe/pipe.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterDashboardComponent } from './components/footer-dashboard/footer-dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { AlertComponent }  from './components/alert/alert.component';
import { TopUpComponent} from './components/top-up/top-up.component';
import { ModelOfWeekComponent} from './components/model-of-week/model-of-week.component' ;
import { NavigationComponent} from './components/navigation/navigation.component';
import { XtalkRatingComponent} from './components/xtalk-rating/xtalk-rating.component';
import { BecomeModelComponent} from './components/become-model/become-model.component';
import { BannerComponent } from './components/banner/banner.component';
import { ConfirmModalComponent } from './widgets/confirm-modal/confirm-modal.component';
import { EditUserModalComponent } from './widgets/edit-user-modal/edit-user-modal.component';
import { EditPackagesComponent } from './widgets/edit-packages/edit-packages.component';
import { ChangePasswordComponent } from './widgets/change-password/change-password.component';
import { ListModelComponent} from './components/list-model/list-model.component';
import { UploadAudioComponent } from './widgets/upload-audio/upload-audio.component';
import { RatingCallComponent } from './widgets/rating-call/rating-call.component';
import { AddUserComponent } from './widgets/add-user/add-user.component';
import { AddPackageComponent } from './widgets/add-package/add-package.component';
import { EditAdsComponent } from './widgets/edit-ads/edit-ads.component';
import { FooterComponent } from './components/footer/footer.component';
import { DialogPolicyComponent} from './widgets/dialog-policy/dialog-policy.component';
import { DebounceClickDirective } from './directive/debounceclick.directive';
import { MobileSidebarComponent} from './components/mobile-sidebar/mobile-sidebar.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ModelCardComponent } from './components/model-card/model-card.component';
import { MessagesChatComponent } from './components/messages-chat/messages-chat.component';
import { FrontEndComponent } from '@/layouts/front-end/front-end.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import {CdkTableModule} from '@angular/cdk/table';
import {A11yModule} from '@angular/cdk/a11y';
import {NgbModule,NgbModal} from '@ng-bootstrap/ng-bootstrap';
//import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatDividerModule} from '@angular/material/divider';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PhotoSwipeModule} from '@/modules/photo-swipe/photo-swipe.module';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSelect,
  MatOption,
  MatOptionModule,
  MatListItem
} from '@angular/material';
import { EditOptionsComponent } from './widgets/edit-options/edit-options.component';
import { NewMessageAlertComponent } from './components/custom-alert/new-message-alert/new-message-alert.component';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [
    A11yModule,
    //ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatOptionModule,
    MatListModule,
    
  ],
  declarations: [FrontEndComponent],
  imports: [],
})
export class ImportsMaterialModule {}
@NgModule({
  declarations: [
    FooterComponent,
    DialogPolicyComponent,
    HeaderComponent,
    FooterDashboardComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    AlertComponent,
    TopUpComponent,
    ModelOfWeekComponent,
    NavigationComponent,
    XtalkRatingComponent,
    BecomeModelComponent,
    BannerComponent,
    ConfirmModalComponent,
    EditUserModalComponent,
    EditPackagesComponent,
    ChangePasswordComponent,
    ListModelComponent,
    UploadAudioComponent,
    RatingCallComponent,
    AddUserComponent,
    AddPackageComponent,
    EditAdsComponent,
    DebounceClickDirective,   
    MobileSidebarComponent, 
    ModelCardComponent,
    EditOptionsComponent,
    MessagesChatComponent,
    NewMessageAlertComponent
  ],
  imports: [
    CommonModule,
    ImportsMaterialModule,
    PipeModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxIntlTelInputModule,
    NgxCaptchaModule,
    PhotoSwipeModule,
    TranslateModule
  ],
  exports: [
    HeaderComponent,
    NgxIntlTelInputModule,
    FooterComponent,
    DialogPolicyComponent,
    FooterDashboardComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    AlertComponent,
    TopUpComponent,
    ModelOfWeekComponent,
    NavigationComponent,
    XtalkRatingComponent,
    BecomeModelComponent,
    BannerComponent,
    ConfirmModalComponent,
    EditPackagesComponent,
    ListModelComponent,
    DebounceClickDirective,
    ModelCardComponent,
    MessagesChatComponent,
    EditOptionsComponent,
    MobileSidebarComponent,
    UploadAudioComponent,
    ImageCropperModule,
    PhotoSwipeModule,
    NgbModule,
    FlexLayoutModule,
    NewMessageAlertComponent,
    TranslateModule
  ],
  entryComponents:[
    NewMessageAlertComponent,
    ConfirmModalComponent,
    EditUserModalComponent,
    EditPackagesComponent,
    ChangePasswordComponent,
    UploadAudioComponent,
    RatingCallComponent,
    AddUserComponent,
    DialogPolicyComponent,
    EditOptionsComponent,
    EditAdsComponent,
        
  ]
})
export class SharedModule { }
