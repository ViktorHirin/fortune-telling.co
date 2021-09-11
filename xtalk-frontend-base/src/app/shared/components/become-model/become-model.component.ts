import { Component, OnInit,ElementRef, ViewChild,AfterViewInit} from '@angular/core';
import {Ads} from '@/_models'
import {environment} from 'environments/environment';
import { PageconfigService } from '@/_servies';
@Component({
  selector: 'app-become-model',
  templateUrl: './become-model.component.html',
  styleUrls: ['./become-model.component.css']
})
export class BecomeModelComponent implements OnInit ,AfterViewInit{
  baseUrl=environment.apiUrl+'/';
  ads:Ads;
  image:String;
  loadingAds:Boolean=false;
  public listBanner;
  @ViewChild('bgEle',{static:false}) bgEle:ElementRef;
  @ViewChild('aboutContainer',{static:false}) aboutContainer:ElementRef;
  constructor(private pageConfigService:PageconfigService,private readonly eleRef:ElementRef) {
    
   }

  ngOnInit() 
  {
   
    setInterval(()=>{
      this.image=this.getRadomContent()?this.getRadomContent().src:'';
    },7000);
    
   
  }

  ngAfterViewInit()
  {
    if(this.bgEle)
    {
    this.pageConfigService.currentAds.subscribe(data=>{
      if(data !=null && data.footer)
      {
        let extraQuery='&width='+this.bgEle.nativeElement.offsetWidth+'&height='+this.aboutContainer.nativeElement.offsetHeight+'&format=png';
        this.listBanner=data.footer[0]?data.footer[0]:[];

        this.loadingAds=false;
        if(this.listBanner.file_doc)
        {
          this.image=environment.apiUrl+'/api/v1/file/banner/?path='+this.listBanner.file_doc[0]+extraQuery;
        }
      }

    });
  }
  }

  getRadomContent()
  {
    if(this.listBanner && this.listBanner.file_doc && this.listBanner.file_doc.length)
    {
      console.log('get width of bgEle');
      let style=getComputedStyle(this.bgEle.nativeElement);
      let extraQuery="";
      this.bgEle.nativeElement.style.height="";
      if(style.maxWidth == "none"){
        extraQuery='&width='+this.bgEle.nativeElement.offsetWidth+'&height='+300+'&format=png';
        this.bgEle.nativeElement.style.height="300px";
      }
      else{

        extraQuery='&width='+this.bgEle.nativeElement.offsetWidth+'&height='+this.aboutContainer.nativeElement.offsetHeight+'&format=png';      }
      
      let index=this.getRandomInt(this.listBanner.file_doc.length);
      return {
        src:environment.apiUrl+'/api/v1/file/banner/?path='+ this.listBanner.file_doc[index]+extraQuery,
        desc: this.listBanner.description[index],
      }
    }

  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  


}
