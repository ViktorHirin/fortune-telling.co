import { Component, OnInit } from '@angular/core';
import { User, CallHistory } from '@/_models';
import { first } from 'rxjs/operators';
import {  AlertService,  } from '@/_servies';
import {WithDrawService} from '@/_servies/withdraws.service';
import {PageconfigService} from '@/_servies/pageconfig.service';

import {CallService} from '@/_servies/call.service';
import { AuthenticationService} from '@/_servies/authentication.service';

import { environment } from 'environments/environment';
//import { join } from 'path';
@Component({
  selector: 'app-talk-history',
  templateUrl: './talk-history.component.html',
  styleUrls: ['./talk-history.component.css']
})
export class TalkHistoryComponent implements OnInit {
  baseUrl = environment.baseUrl;
  listTalk = [];
  page = 1;
  pageSize = 9;
  user: User;
  spent = 0;
  blance = 0;
  commission = 0;
  minutes = 0;
  price: any;
  currency: string = '$';
  rate: number = 0;
  constructor(private authentication: AuthenticationService, private callService: CallService
    , private alertService: AlertService, private pageConfigService: PageconfigService, private withdrawService: WithDrawService) {
    this.pageConfigService.currentConfig.subscribe(data => {
      if (data) {
        this.price = data.price || 10;
        this.currency = data.currency;
      }
    })
  }

  ngOnInit() {
    this.authentication.reload();
    this.user = this.authentication.currentUserValue;
    if (this.user.role == 'member') {
      this.callService.getAllHistory().pipe(first())
        .subscribe(
          data => {
            data['data']['listCall'].forEach(element => {
              var item = new CallHistory().deserialize(element);
              this.spent += item.getToken(this.price);
              this.listTalk.push(item);

            });
            this.minutes = (Math.floor(data['data']['token'] / this.price));
            this.blance = data['data']['token'];
          }
          , err =>
            this.alertService.error(err)
        );
    }
    else {
      this.callService.getAllHistoryofModel().pipe(first())
        .subscribe(
          data => {
            if(data['data']['listCall'].length)
            {
              data['data']['listCall'].forEach(element => {
                var item = new CallHistory().deserialize(element);
                this.listTalk.push(item);
              });
            }
            this.spent = data['data'].token;
          }
          , err =>{}
            //this.alertService.error(err)
        );
      this.withdrawService.getBlance().subscribe(data => {
        this.rate = data['data'].rate || 1;
        this.commission = data['data']['commission'];
      }, err => {
        this.alertService.error(err['data'].msg);
      })

    }

  }

  reload() {
    location.pathname = '/get-minutes';
  }

  floor(input: number): number {
    return Math.floor(input);
  }

  public initToFloat(number: number, fix: number = 2) {
    let input = number.toString();
    input = parseFloat(input).toFixed(fix);

    return input;
  }

  public getAdminCommission(commission: number) {
    return this.initToFloat((this.spent * commission) / (100 * this.rate));
  }

  public getSpent() {
    let spendFloat = this.spent / this.rate
    return this.initToFloat(spendFloat);
  }

  public getBlance() {
    return this.initToFloat((this.spent - (this.spent * this.commission) / 100) / this.rate);
  }
}
