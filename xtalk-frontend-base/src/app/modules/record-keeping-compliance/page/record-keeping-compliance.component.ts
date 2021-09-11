import { Component, OnInit } from '@angular/core';
import { PageconfigService, AlertService } from '@/_servies';
import { Alert } from '@/_models';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
@Component({
  selector: 'record-keeping-compliance',
  templateUrl: './record-keeping-compliance.component.html',
  styleUrls: ['./record-keeping-compliance.component.css']
})
export class RecordKeepingComplianceComponent implements OnInit {
  content:any;
  constructor(
    private sanitizer: DomSanitizer,
    private alertService:AlertService,
    private pageConfig:PageconfigService
  ) { 
  }

  ngOnInit() {
    const slug='record-keeping-compliance';
    this.pageConfig.getStaticPage(slug).subscribe(response=>{
      this.content=this.sanitizer.bypassSecurityTrustHtml(response.data.content);
    },err=>{
      this.alertService.error("Errors")
    })
  }

}
