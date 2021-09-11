import { Component, OnInit, Sanitizer } from '@angular/core';
import { IArticle } from '@/_models/Interface/IArticle';
import { AlertService } from '@/_servies/alert.service';
import { PageconfigService } from '@/_servies/pageconfig.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  article: IArticle;
  content: any;
  constructor(private pageConfigService: PageconfigService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private sanitizer: DomSanitizer
  ) {
    this.activeRoute.params.subscribe(param => {
      this.pageConfigService.getStaticPage(param['slug']).subscribe(response => {
        if (response && response.data) {
          this.article = response.data;
          this.content = this.sanitizer.bypassSecurityTrustHtml(response.data.content);
          this.titleService.setTitle(response.data.title);
        }
        else {
          this.alertService.error('Page not found', true);
          this.router.navigate(['/home']);
        }
      }, error => {
        this.alertService.error('Page not found', true);
        this.router.navigate(['/home']);
      })
    })
  }

  ngOnInit() {

  }

}
