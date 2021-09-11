import { Component, OnInit } from '@angular/core';
import { PageconfigService, AlertService } from '@/_servies';
import { Alert } from '@/_models';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'
@Component({
  selector: 'app-how-to-call',
  templateUrl: './how-to-call.component.html',
  styleUrls: ['./how-to-call.component.css']
})
export class HowToCallComponent implements OnInit {
  content:any;
  constructor(
    private sanitizer: DomSanitizer,
    private alertService:AlertService,
    private pageConfig:PageconfigService
  ) { 
  }

  ngOnInit() {
    const slug='how-to-call';
    this.pageConfig.getStaticPage(slug).subscribe(response=>{
      this.content=this.sanitizer.bypassSecurityTrustHtml(response.data.content);
    },err=>{
      this.alertService.error("Errors")
    })
  }

}
