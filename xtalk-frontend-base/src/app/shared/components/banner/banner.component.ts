import { Component, OnInit ,AfterViewInit} from '@angular/core';
import {PageconfigService} from '@/_servies';
import {Ads} from '@/_models/ads.model';
import {environment} from 'environments/environment';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  ads:any;
  loadingAds:Boolean=true;
  images;
  titles;
  descriptions;
  baseUrl=environment.apiUrl+'/';
  constructor(private pageConfigService:PageconfigService) { 
    
  }
  ngOnInit() {
    this.pageConfigService.currentAds.subscribe(data=>{
      if(data !=null)
      {
        this.images=data.header[0]?data.header[0].file_doc:[];
        this.titles=data.header[0]?data.header[0].title:[];
        this.descriptions=data.header[0]?data.header[0].description:[];
        this.loadingAds=false;
      }

    })
    
  }

  ngAfterViewInit()
  {
    
  }

  getImageUrl(image:String){
    return environment.apiUrl+'/'+image;
  }

  getTitle(i:number)
  {
    return this.titles[i]?this.titles[i]:'';
  }

  getDescriptions(i:number)
  {
    return this.descriptions[i]?this.descriptions[i]:'';
  }
}
