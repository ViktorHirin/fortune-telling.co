import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalstorageService} from '@/_servies/localstorage.service';
import {  AlertService} from '@/_servies/alert.service';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { UserService} from '@/_servies/user.service';
import { environment } from 'environments/environment';
import { User, Config } from '@/_models';
import { Router } from '@angular/router';
import { AppComponent} from '../../../app.component'
declare const $: any;
@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css']
})
export class TopUpComponent implements OnInit {
  paymentSetting: any;
  ccbillPath: String = environment.ccbill_endpoint;
  listTopup = [];
  user: User;
  config: Config;
  ccbill: String = "https://bill.ccbill.com/jpost/signup.cgi?clientAccnum=";
  constructor(private localStorage:LocalstorageService, private httpClient: HttpClient, private alertService: AlertService, private authentication: AuthenticationService, private pageConfig: PageconfigService) {
    this.pageConfig.currentConfig.subscribe(data => {
      if (data != undefined) {
        this.config = data;
      }
    })
    this.httpClient.get<any>(`${environment.apiUrl}/api/v1/payment-setting/list/top-up`)
      .subscribe(
        data => {
          this.listTopup = data.data;
        },
        err => {
          this.alertService.error(err);
        }
      );



  }

  ngOnInit() {
    this.user=new User();
    AppComponent.isBrowser.subscribe(isBowser=>{
      if(isBowser)
      {
        this.user = new User().deserialize(JSON.parse(this.localStorage.getItem('currentUser')));
      }
    })
    
  }

  getPrice(number){
    return parseFloat(number).toFixed(2)
  }

}
