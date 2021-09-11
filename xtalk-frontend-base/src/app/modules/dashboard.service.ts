import { Injectable } from '@angular/core';
import { UserService , ModelService, AlertService} from '@/_servies';
import { User ,Model} from '@/_models';
import { IUser} from '@/_models/Interface/IUser';
import { IModel} from '@/_models/Interface/IModel';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject,BehaviorSubject } from 'rxjs';
import { isBuffer } from 'util';
import {Order} from '@/_models/order.model';
import { map } from 'rxjs/operators';
import {environment} from 'environments/environment';
import { identifierModuleUrl } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private currentListOrderSubject:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public currentListOrder=this.currentListOrderSubject.asObservable();
  private currentListUserSubject:BehaviorSubject<IUser>=new BehaviorSubject<IUser>(null);
  public currentListUser= this.currentListUserSubject.asObservable();
  private alartService:AlertService;
  public reports:any;
  private currentListPayoutSubject:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public currentListPayout=this.currentListOrderSubject.asObservable();
  private currentListModelSubject:BehaviorSubject<IModel>=new BehaviorSubject<IModel>(null);
  public currentListModel= this.currentListModelSubject.asObservable();
  constructor(private userService:UserService,
    private modelService:ModelService,
    private httpClient:HttpClient) {
    userService.getAllUserasAdmin().subscribe(
      data=>{
        this.currentListUserSubject.next(data);
      }
    );
    modelService.getAllModelasAdmin().subscribe(
      data=>{
        this.currentListModelSubject.next(data);
      }
    );
    
   }

  reloadListUser(){
    this.userService.getAllUser().subscribe(
      data=>{
        var temp:User[]=[];
        data.data.forEach((user,index,userEle) => {
            temp.push(new User().deserialize(user));
            if(index==this.currentListUserSubject.value.data.length){
              this.currentListUserSubject.next(data);
            }
            
        });
       
      }
    );
    
  }

  reloadListModel(){
    this.modelService.getAllModel().subscribe(
      data=>{
        var temp:User[]=[];
        data.data.forEach((user,index,userEle) => {
            temp.push(new User().deserialize(user));
            if(index == this.currentListModelSubject.value.data.length){
              this.currentListModelSubject.next(data);
            }
        });
       
      }
        );
       
      }

  public get currentListUserValue(): IUser{
    if(this.currentListUserSubject.value)
    {
      return this.currentListUserSubject.value;
    }
    else
    {
      this.userService.getAllUser().subscribe(
        data=>{
          return data;
        }
      ),err=>{
        this.alartService.error("Errors");
      };
    }
  }

  public get currentListModelValue():IModel{
    if(this.currentListModelSubject.value)
    {
      return this.currentListModelSubject.value;
    }
    else
    {
      this.modelService.getAllModel().subscribe(
        data=>{
          return data;
        }
      ),err=>{
        this.alartService.error("Errors");
      };
    }
  }

  public get currentListPayoutValue():any{
    return this.currentListPayoutSubject.value;
  }


  bigChart() {
    return [{
      name: 'User',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }, {
      name: 'Model',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }, {
      name: 'WithDraws',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }, {
      name: 'Reviews',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }, {
      name: 'Orders',
      data: [2, 2, 2, 6, 13, 30, 46 ,0,0,0,0,0]
    }];
  }

  cards() {
    return [71, 78, 39, 66];
  }

  

  public getReports()
  {
    return this.httpClient.get<any>(`${environment.apiUrl}/api/backend/reports`);
  }

  public getCharts()
  {
    return this.httpClient.get<any>(`${environment.apiUrl}/api/backend/reports/charts`);
  }

  getListOrder(sort: string='id', order: string='desc', page: number=0,limit:number=20)
  {      
    const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
    return this.httpClient.get<any>(`${environment.apiUrl}/api/backend/order/${queryUrl}`).pipe(map(data=>{
      let dataMap= data.data.map(element => {
         
         return new Order().deserialize(element);

      });
      data.data = dataMap;
      return data;
      
    }));
  }

  getListPayout(sort: string='id', order: string='desc', page: number=0,limit:number=20)
  {      
    const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
    return this.httpClient.get<any>(`${environment.apiUrl}/api/backend/payout/`);
  }
}
