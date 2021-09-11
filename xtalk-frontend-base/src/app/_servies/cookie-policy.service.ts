import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import { map } from 'rxjs/operators';
// //import { CallService} from './call.service';
// import { Bank } from '@/_models';
// import { environment } from '../../environments/environment';
// import { Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CookiePolicyService {
  // cookiePolicyApi:string="https://www.iubenda.com/api/privacy-policy/87393239/cookie-policy";
  // privacyPolicyApi:string ="https://www.iubenda.com/api/privacy-policy/87393239";
  // public cookiePolicySubject=new  Subject;
  // public privacyPolicySubject:Subject;
  // constructor(private httpClient:HttpClient) { 
  //   this.cookiePolicySubject=new Subject();
  //   this.privacyPolicySubject=new Subject();
  // }

  // public get currentBankInfoValue() {
  //   return this.cookiePolicySubject.value;
  // }

  // public getListCountry(){
  //   return this.httpClient.get<any[]>(`${environment.apiUrl}/api/v1/bank/list-country`);
  // }

  // public updateBankInfo(bank:Bank){
  //   return this.httpClient.put<any>(`${environment.apiUrl}/api/v1/bank/update`,{bankInfo:bank});
  // }

  // public getBankInfo(){
  //   return this.httpClient.get<Bank>(`${environment.apiUrl}/api/v1/bank/me`).subscribe(data=>{
  //     if(data['data']){
  //       this.currentBankInfoSubject.next(data['data']);
  //     }
  //   });
  // }

  // public updateBankData(bank:Bank){
  //   this.currentBankInfoSubject.next(bank);
  // } 
}
