import { Component, OnInit , Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlDirective } from '@angular/forms';
import { first } from 'rxjs/operators';
import {ReviewService} from '@/_servies/review.service'
import {AlertService} from '@/_servies/alert.service';
import { Review, Model } from '@/_models';

@Component({
  selector: 'xtalk-review',
  templateUrl: './xtalk-rating.component.html',
  styleUrls: ['./xtalk-rating.component.css']
})
export class XtalkRatingComponent implements OnInit {
  submitted:boolean;
  loading:boolean;
  review:Review;
  reviewForm:FormGroup;
  rating:Number=3;
  ratingFormCtrl=new FormControl(null,Validators.required);
  @Input()
  userId:Number;
  @Input()
  model:Model;
  constructor(private alertService:AlertService,
    private formBuilder: FormBuilder,
    private reviewsService:ReviewService) { 
    
  }

  get f() { return this.reviewForm.controls; }
  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
      content: ['', [Validators.required]],
//      ratingFormCtrl:[' ',[Validators.required]]
  });
  }
  onSubmit() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.reviewForm.invalid) {
        return;
    }

    this.loading = true;
    this.review=new Review().deserialize({
      'rating':this.rating,
      'content': this.f.content.value,
      'userId':this.userId})
    this.reviewsService.postReview(this.review)
        .pipe(first())
        .subscribe(
            data => {
              if(data['status'] == 'failed')
              {
                this.alertService.error(data['msg']); 
              }
              else
              {
                this.alertService.success("Successful");
              }

            },
            error => {
                this.alertService.error('Errors');
                this.loading = false;
            });
}
}
