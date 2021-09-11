import { Component, OnInit,Input,OnDestroy,ViewChild  } from '@angular/core';
import {  ActivatedRoute, Router,NavigationEnd} from '@angular/router'
import { ModalService } from '../../../_modal';
import { ModelService,MyGalleryService, AlertService } from '@/_servies';
import {ReviewService} from '@/_servies/review.service';
import {AuthenticationService} from '@/_servies/authentication.service';

import {CallService} from '@/_servies/call.service';

import { first } from 'rxjs/operators';
import { Model, Review, User,Gallery} from '@/_models';
import { callbackify } from 'util';
import { environment} from 'environments/environment';
import {TimeHelper} from '@/_helpers';
import { env } from 'process';
import { PhotoSwipeComponent} from '@/modules/photo-swipe/photo-swipe/photo-swipe.component'
import {NgbModal, ModalDismissReasons,NgbCarousel,NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
declare const Twilio: any;
@Component({
  selector: 'app-model-detail',
  templateUrl: './model-detail.component.html',
  styleUrls: ['./model-detail.component.css'],
  providers: [NgbCarouselConfig]
})
export class ModelDetailComponent implements OnInit,OnDestroy {
  @Input()
  id: String;
  currentGallery:Gallery;
  getModelInter:any;
  closeResult = '';
  Twilio:any;
  reviewConfig:any={
    reviewLength:3,
    reviewSort:'DESC',
    reviewSortBy:'rating',
    reviewPage:1
  };
  title=environment.appTitle;
  homeUrl=environment.baseUrl;
  host=environment.apiUrl+'/';
  listGallery:Gallery[]=[];
  timeHelper:TimeHelper;
  now=new Date();
  readonly:boolean=true;
  twilioToken:String;
  private sub: any;
  model:Model=new Model();
  user:User;
  listReviews:Review[]=[];
  availableModel:Model[]=[];
  @ViewChild('myCarousel',{static:true}) myCarousel: NgbCarousel;
  @ViewChild('photoSwipe', {static: false}) photoSwipe: PhotoSwipeComponent;
  constructor(private modalService: ModalService,
              private router:ActivatedRoute,
              private modelService:ModelService,
              private alertService:AlertService,
              private reviewService:ReviewService,
              private callService:CallService,
              private route:Router,private config: NgbCarouselConfig,
              private ngbModalService: NgbModal,
              private galleryService:MyGalleryService,
              private authentication:AuthenticationService) { 
                this.config.interval = 1000000;
                this.config.wrap = false;
                this.config.keyboard = false;
                this.timeHelper=new TimeHelper(this.authentication);
                this.sub = this.router.params.subscribe(params => {
                this.id = params['id'];
                this.boostrap(this.id);
                });
                
              }

    ngOnInit() {
      var bodyEle=document.getElementsByTagName('body')[0];
     // bodyEle.scrollIntoView();  
      this.user=this.authentication.currentUserValue;   
  }
  

boostrap(id:String){
  this.loadModelInfo(id);
  this.loadReviewOfModel(id);
  this.loadListModel(3);
  //this.loadListGallery(id);
 // this.getTwilioToken();
  
}

private loadModelInfo(id:String){
  this.modelService.getModelInfo(id).pipe(first()).subscribe(data=>{
    this.model=new Model().deserialize(data['data']);
    this.modelService.updateCurrentModel(this.model);
    this.modelService.currentModel$.subscribe(data=>{
      this.model=data;
    })
  })
}


private loadListGallery(id:String)
  {
    this.listGallery=[];
    this.galleryService.getGallery(id).subscribe(
      data=>{
        data['data'].map(item=>{
          this.listGallery.push(new Gallery().deserialize(item));
        });
      },
      error=>{
        this.alertService.error(error.msg);
      }     
    )
  }

private loadReviewOfModel(id:String){

    this.listReviews=[];
    this.reviewService.getReviewOfUser(id).pipe(first()).subscribe(
      data=>{
        const rep=data.data;

        rep.forEach(element => {
          this.listReviews.push(new Review().deserialize(element).setUser(element.reviewerId));          
        });
      },
      error=>{
        this.alertService.error(error);
      }
    )
}

private loadListModel(length:Number){
  this.availableModel=[];
  this.modelService.getListModel(length)
  .pipe(first())
  .subscribe(
      data => {        
         data['data'].forEach(element => {
          this.availableModel.push( new Model().deserialize(element));
          
         });
      },
      error => {
          this.alertService.error(error);
      });
}

private getTwilioToken(){
  this.modelService.getTwilioToken().pipe(first())
                    .subscribe(
                      data=>{
                      let s=JSON.stringify(data['token']);
                      this.twilioToken=s.slice(1,s.length-1);
                      Twilio.Device.setup(this.twilioToken);
                      
                      Twilio.Device.ready(function (device) {
                      });
                
                      Twilio.Device.error(function (error) {
                        console.log('Twilio.Device Error: ' + error.message);
                      });
                
                      Twilio.Device.connect(function (conn) {
                        // console.log('Successfully established call!');
                        // document.getElementById('button-call').style.display = 'none';
                        // document.getElementById('button-hangup').style.display = 'inline';
                        // volumeIndicators.style.display = 'block';
                        // bindVolumeIndicators(conn);
                      });
                
                      Twilio.Device.disconnect(function (conn) {
                        console.log('Call ended.');
                        // document.getElementById('button-call').style.display = 'inline';
                        // //document.getElementById('button-hangup').style.display = 'none';
                        // volumeIndicators.style.display = 'none';
                      });
                
                      Twilio.Device.incoming(function (conn) {
                        console.log('Incoming connection from ' + conn.parameters.From);
                        var archEnemyPhoneNumber = '+12099517118';
                
                        if (conn.parameters.From === archEnemyPhoneNumber) {
                          conn.reject();
                          console.log('It\'s your nemesis. Rejected call.');
                        } else {
                          // accept the incoming connection and start two-way audio
                          conn.accept();
                        }
                

                      }
                      )
                    }
                      ,
                      error => {
                        this.alertService.error(error);
                    });
                  }

public call(){
  if(!this.authentication.currentUserValue)
  {
    this.alertService.info('Please login to use this service');
     this.route.navigate(['/'], { queryParams: { returnUrl: this.route.getCurrentNavigation() }});
    return ;
  }
  if(this.model.doNotDisturb || this.model.isCalling)
  {
    this.alertService.error("Model can't receive call, please call later");
    return;
  }
  else
  {
    this.callService.call(this.model);
  }
}
ngOnDestroy()
{
  clearInterval(this.getModelInter);
}
 openModal= async (content,index)=> {
 
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

getImageUrl(fileBaseUrl:string)
{
  return this.host+fileBaseUrl;
}
viewImage = (index) => {
  let images = this.listGallery;
  this.photoSwipe.openGallery(images, true,index);
}
}