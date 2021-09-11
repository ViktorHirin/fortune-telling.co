import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ModalService } from '../../../_modal';
import { ModelService, ReviewService } from '@/_servies';
import {AuthenticationService} from '@/_servies/authentication.service';
import {AlertService} from '@/_servies/alert.service';

import {CallService} from '@/_servies/call.service';

import { first } from 'rxjs/operators';
import { environment} from 'environments/environment'
import { Model, Review, User } from '@/_models';
import { callbackify } from 'util';
import { TimeHelper} from '@/_helpers/time';
declare const Twilio: any;
@Component({
  selector: 'app-all-review',
  templateUrl: './all-review.component.html',
  styleUrls: ['./all-review.component.css']
})
export class AllReviewComponent implements OnInit {
  loadOptions:any={
    sort:'createdAt',
    order:"desc",
    page:0,
    limit:10
  };
  canLoadMore:Boolean=true;
  id: String;
  totalReview:number=0;
  baseDetailUrl=environment.baseUrl;
  Twilio: any;
  twilioToken: String;
  user: User;
  private sub: any;
  model: Model = new Model();
  listReviews: Review[] = [];
  rating: Number;
  canReview:boolean=true;
  availableModel: Model[] = [];
  timeHelper:TimeHelper;
  now=new Date();
  constructor(private modalService: ModalService,
    private router: ActivatedRoute, private authentication: AuthenticationService,
    private modelService: ModelService,
    private alertService: AlertService,
    private callService:CallService,
    private reviewService: ReviewService) {
      this.timeHelper=new TimeHelper(this.authentication);

  }

  ngOnInit() {
    this.sub = this.router.params.subscribe(params => {
      this.id = params['id'];
      this.boostrap();
    });
    this.user = this.authentication.currentUserValue;
    this.canReview =this.user.id?true:false;
  }
  boostrap() {
    this.loadModelInfo();
    this.loadReviewOfModel();
    //this.getTwilioToken();
  }

  private loadModelInfo() {
    this.modelService.getModelInfo(this.id)
      .pipe(first())
      .subscribe(
        data => {
          this.model = new Model().deserialize(data['data']);
          this.rating = this.model.rating ? this.model.rating : 3;
        },
        error => {
          this.alertService.error(error);
        });
    //.unsubscribe();
  }

  private loadReviewOfModel() {
    this.reviewService.getReviewOfUser(this.id,this.loadOptions).pipe(first()).subscribe(
      data => {
        const rep = data.data;
        if(this.user)
        {
          rep.forEach(element => {
            if(element.reviewerId.id == this.user.id )
            {
              this.canReview=false;
            }
            this.totalReview++;
            this.listReviews.push(new Review().deserialize(element).setUser(element.reviewerId));
          });
          if(this.totalReview < (this.loadOptions.page+1)*this.loadOptions.limit)
          {
            this.canLoadMore=false;
          }
        }
        else
        {
          rep.forEach(element => {
            this.totalReview++;
            this.listReviews.push(new Review().deserialize(element).setUser(element.reviewerId));
          });
        }
        
      },
      error => {
        this.alertService.error(error);
      }
    )

  }

 

  public call() {
    this.callService.call(this.model);
  }

  public loadMoreClick()
  {
    this.loadOptions.page++;
    this.loadReviewOfModel();
  }
}
