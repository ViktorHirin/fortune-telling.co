import { Component, OnInit } from '@angular/core';
import { SeoConfigModule } from '../seo-config.module';
import { ISeo } from '@/_models/Interface/ISeo';
import { AlertService, SeoConfigService } from '@/_servies/'
@Component({
  selector: 'app-seo-config',
  templateUrl: './seo-config.component.html',
  styleUrls: ['./seo-config.component.css']
})
export class SeoConfigComponent implements OnInit {
  seoConfig: ISeo;
  loading: Boolean = false;
  constructor(
    private seoService: SeoConfigService,
    private alertService: AlertService
  ) {
    this.seoService.currentSeo.subscribe(data => {
      if (data) {
        this.seoConfig = data;
      }
      else {
        this.seoConfig = {
          title: '',
          description: '',
          keyword: ''
        }
      }
    })
  }
  ngOnInit() {

  }

  onSubmit() {
    this.seoService.updateSeoConfig(this.seoConfig).subscribe(data => {
      this.seoService.reload();
      this.alertService.success('The update was successful');
    },
      error => {
        this.alertService.error('Failed');
      });
  }

}
