import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '@/_models';
import {  ReviewService } from '@/_servies/review.service';
import {AlertService} from '@/_servies/alert.service';
export interface DialogData {
  callId: string;
  me: User;
  id: string;
}

@Component({
  selector: 'app-rating-call',
  templateUrl: './rating-call.component.html',
  styleUrls: ['./rating-call.component.css']
})
export class RatingCallComponent implements OnInit {
  submitted: boolean;
  loading: boolean;
  reviewForm: FormGroup;
  rating: Number = 3;
  ratingFormCtrl = new FormControl(null, Validators.required);
  constructor(
    public dialogRef: MatDialogRef<RatingCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private reviewsService: ReviewService) { }

  onNoClick(): void 
  {
    this.dialogRef.close();
  }

  ngOnInit() 
  {
    this.reviewForm = this.formBuilder.group({
      ratingFormCtrl: [' ', [Validators.required]]
    });
  }

  public get f() 
  {
    return this.reviewForm.controls;
  }

  public onSubmit()
   {
    if (this.reviewForm.invalid) {
      return;
    }
    const dataRating = {
      userId: this.data.me.id,
      callId: this.data.callId,
      rating: this.rating,
      id: this.data.id,
    }
    if(!this.loading)
    { 
      this.loading=true;
      this.reviewsService.postRatingCall(dataRating).subscribe(data => 
        {
        this.alertService.success("Successful", false, true);
        this.dialogRef.close();
        this.loading=false;
        },
        err => {
          this.loading=false;
          this.dialogRef.close();
          this.alertService.error(err.msg, false, true);
        });
    }
    
  }

  ngOnDestroy() {

  }

}
