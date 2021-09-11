import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService, PageconfigService } from '@/_servies/';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-page-config',
  templateUrl: './page-config.component.html',
  styleUrls: ['./page-config.component.css']
})
export class PageConfigComponent implements OnInit {
  fileData: File = null;
  host: string = environment.apiUrl + '/';
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  pageConfig;
  loading: boolean = false;
  constructor(private pageConfigService: PageconfigService, private alertService: AlertService) {
    this.pageConfig = pageConfigService.currentConfigValue;
    this.pageConfigService.currentConfig.subscribe(data => {
      this.pageConfig = data;
    })
  }

  ngOnInit() {
  }
  onSubmit() {
    this.pageConfigService.updateConfig(this.fileData, this.pageConfig).subscribe(data => {
      this.pageConfigService.reload();
      this.alertService.success('The update was successful');
    },
      error => {
        this.alertService.error('Failed');
      });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.pageConfig.logo.data = this.previewUrl;
    }
  }
  uploadFavicon(fileInput: any) {
    this.loading = true;
    let faviconData = <File>fileInput.target.files[0];
    this.pageConfigService.uploadsFavicon(faviconData).subscribe(data => {
      if (data && data.data.url) {
        this.pageConfig.faviconLink = data.data.url;
      }
      this.loading = false;
    }, err => {
      this.alertService.error(err.data.msg);
      this.loading = false;
    });
  }


}
