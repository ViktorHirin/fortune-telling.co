import { Component, OnInit } from '@angular/core';
import { PageconfigService, AlertService } from '@/_servies';
import { Alert } from '@/_models';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  content:any;
  constructor(
    private sanitizer: DomSanitizer,
    private alertService:AlertService,
    private pageConfig:PageconfigService
  ) { 
  }

  ngOnInit() {
    const slug='terms-conditions';
    this.pageConfig.getStaticPage(slug).subscribe(response=>{
      this.content=this.sanitizer.bypassSecurityTrustHtml(response.data.content);
    },err=>{
      this.alertService.error("Errors")
    })
  }

}
