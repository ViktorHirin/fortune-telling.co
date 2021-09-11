import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {  AlertService} from '@/_servies/alert.service';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { environment } from 'environments/environment'
import { User, Config } from '@/_models';
@Component({
  selector: 'app-get-minutes',
  templateUrl: './get-minutes.component.html',
  styleUrls: ['./get-minutes.component.css']
})
export class GetMinutesComponent implements OnInit {
  paymentSetting: any;
  listTopup = [];
  title=environment.appTitle;
  homeUrl=environment.baseUrl;
  pageConfig: Config;
  user: User;
  ccbillPath: String = environment.ccbill_endpoint;
  ccbill: String = "https://bill.ccbill.com/jpost/signup.cgi?clientAccnum=";
  constructor(private httpClient: HttpClient, private alertService: AlertService, 
    private route: ActivatedRoute,
    private pagconfigService: PageconfigService, private authentication: AuthenticationService) {
    this.httpClient.get<any>(`${environment.apiUrl}/api/v1/payment-setting/list/top-up`)
      .subscribe(
        data => {
          this.listTopup = data.data;
        },
        err => {
          this.alertService.error(err);
        }
      );
    this.pagconfigService.currentConfig.subscribe(data => {
      if (data != null) {
        this.pageConfig = data;
      }
      else {
        this.pageConfig = new Config();
      }
    });
  }
  ngOnInit() 
  {
    this.route.queryParams.subscribe(params => {
      if(this.authentication.currentUserValue )
      {
        if (params['message']) {
          switch (params['msgType']) {
            case 'success':
              this.alertService.success(params['message']);
              break;
            case 'error':
              this.alertService.error(params['message']);
              break;
            default:
              this.alertService.success(params['message']);
              return;
          }
        }
        if (params['reload']) {
          this.authentication.reload();
        }
      }
    });
    this.user = this.authentication.currentUserValue;
  }

  public getMinutes(token, price) {
    return Math.floor(token / price);
  }
  getPrice(number) {
    return parseFloat(number).toFixed(2)
  }
}
