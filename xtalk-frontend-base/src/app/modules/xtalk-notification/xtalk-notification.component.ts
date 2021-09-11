import { Component, OnInit } from '@angular/core';
import { Notification,User } from '@/_models';
import { XtalkNotificationService} from '@/_servies/xtalk-notification.service';
import {AuthenticationService} from '@/_servies/authentication.service';

@Component({
  selector: 'app-xtalk-notification',
  templateUrl: './xtalk-notification.component.html',
  styleUrls: ['./xtalk-notification.component.css']
})
export class XtalkNotificationComponent implements OnInit {
  user:User;
  page=1;
  pageSize =10;
  notifications:Notification[]=[];

  constructor(private notification:XtalkNotificationService,
    private authentication:AuthenticationService) { 
      this.user= this.authentication.currentUserValue;

    }

  ngOnInit() {
  }

  getAllNotification(){

  }


}
