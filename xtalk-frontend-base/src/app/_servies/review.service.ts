import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Review} from '@/_models';
import { environment} from '../../environments/environment';
import { AlertService} from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private Http:HttpClient,
    private authentication:AuthenticationService,
    private alertService:AlertService
  ) { }

  getReviewOfUser(id:String,options:any=null)
  {
    if(options == null)
    {
      options={limit:3,order:'DESC',sort:'createdAt',page:0}
    }
    const queryString=`?limit=${options.limit}&sort=${options.sort}&order=${options.order}&page=${options.page+1}`;
    return this.Http.get<any>(`${environment.apiUrl}/api/v1/reviews/model/${id}${queryString}`);
  }

  deleteReview(id:String){
    return this.Http.delete(`${environment.apiUrl}/api/v1/reviews/${id}`);
  }

  postReview(reviews:Review){
    if(this.authentication.currentUserValue)
    {
      return this.Http.post(`${environment.apiUrl}/api/v1/reviews/model`,reviews);
    }
    else
    {
      this.alertService.error('Signup / Login to post review');
    }
    
  }

  getAllReview(sort: string='id', order: string='desc', page: number=0,limit:number=20)
  {
      const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
      return this.Http.get<any>(`${environment.apiUrl}/api/v1/reviews/all${queryUrl}`);
  }

  postRatingCall(data){
    return this.Http.post<any>(`${environment.apiUrl}/api/v1/reviews/call`,data);
  }

}
