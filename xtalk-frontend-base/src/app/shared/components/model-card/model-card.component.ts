import { Component, OnInit ,Input,  OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import {ImageHelper} from '@/_helpers/image'
@Component({
  selector: 'app-model-card',
  templateUrl: './model-card.component.html',
  styleUrls: ['./model-card.component.css']
})
export class ModelCardComponent implements OnInit {
  @Input() model;
  @Input('size') size='big';
  imageWidth:number;
  imageHeight:number;
  imageHelper:ImageHelper;
  format:string='png';
  defaultImage:string=environment.apiUrl+ '/assets/images/img.jpg';
  public apiUrl=environment.apiUrl;
  constructor() { 
    this.imageHelper= new ImageHelper();
  }

  ngOnInit() {
    switch(this.size)
    {
      case 'thumbnail':
        this.imageHeight=environment.imageSize.thumbnail.height;
        this.imageWidth=environment.imageSize.thumbnail.width;
        break;
      case 'medium':
        this.imageHeight=environment.imageSize.medium.height;
        this.imageWidth=environment.imageSize.medium.width;
        break;
      case 'big':
        this.imageHeight=environment.imageSize.big.height;
        this.imageWidth=environment.imageSize.big.width;
        break;
    }
  }

  public getAvatar(avatarPath:string='assets/images/img.jpg')
  {
    let avatarArray=avatarPath.split('/');
    let nameImage=avatarArray[avatarArray.length-1];
    nameImage=this.imageWidth+'x'+this.imageHeight+'_'+nameImage;
    avatarArray[avatarArray.length-1]=nameImage;
    return avatarArray.join('/');
  }

  public setDefaultPic(){
    return this.defaultImage;
  }

}
