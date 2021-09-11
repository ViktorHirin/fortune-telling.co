import { Component, OnInit,Inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
@Component({
  selector: 'app-new-message-alert',
  templateUrl: './new-message-alert.component.html',
  styleUrls: ['./new-message-alert.component.css']
})
export class NewMessageAlertComponent implements OnInit {

  constructor(private snackBarRef: MatSnackBarRef<NewMessageAlertComponent>,@Inject(MAT_SNACK_BAR_DATA) public data: any){}
  close(){
    this.snackBarRef.dismiss();
  }

  ngOnInit() {
  }

}
