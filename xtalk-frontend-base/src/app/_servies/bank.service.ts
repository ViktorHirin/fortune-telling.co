import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
//import { CallService} from './call.service';
import { Bank } from '@/_models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BankService {
  private currentBankInfoSubject: BehaviorSubject<Bank>;
  public currentBankInfo:Observable<Bank>;

  constructor(private httpClient:HttpClient) { 
    this.currentBankInfoSubject=new BehaviorSubject<Bank>(new Bank());
    this.currentBankInfo=this.currentBankInfoSubject.asObservable();
  }

  public get currentBankInfoValue() {
    return this.currentBankInfoSubject.value;
  }

  public getListCountry(){
    return this.httpClient.get<any[]>(`${environment.apiUrl}/api/v1/bank/list-country`);
  }

  public updateBankInfo(bank:Bank){
    return this.httpClient.put<any>(`${environment.apiUrl}/api/v1/bank/update`,{bankInfo:bank});
  }

  public getBankInfo(){
    return this.httpClient.get<Bank>(`${environment.apiUrl}/api/v1/bank/me`).subscribe(data=>{
      if(data['data']){
        this.currentBankInfoSubject.next(data['data']);
      }
    });
  }

  public updateBankData(bank:Bank){
    this.currentBankInfoSubject.next(bank);
  } 
}
