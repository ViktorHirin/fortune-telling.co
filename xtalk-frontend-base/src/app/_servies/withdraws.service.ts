import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {WithDraw} from '@/_models';
import {IWithDraw } from '@/_models/Interface/IWithDraw';
import { environment} from '../../environments/environment';
import {Observable,Subject,BehaviorSubject} from 'rxjs'
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
@Injectable({
  providedIn: 'root'
})
export class WithDrawService {
    private currentListWithDrawSubject:BehaviorSubject<WithDraw[]>;
    public  currentListWithDraw:Observable<WithDraw[]>;
    private currentTotalWithDrawSubject:BehaviorSubject<WithDraw[]>;
    public  currentTotalWithDraw:Observable<WithDraw[]>;
    
    constructor( private Http:HttpClient) {
        this.currentListWithDrawSubject = new BehaviorSubject<WithDraw[]>([]);
        this.currentListWithDraw = this.currentListWithDrawSubject.asObservable();
        this.currentTotalWithDrawSubject = new BehaviorSubject<WithDraw[]>([]);
        this.currentTotalWithDraw = this.currentTotalWithDrawSubject.asObservable();
        this.getList().subscribe(res=>{
            this.currentListWithDrawSubject.next(res['data']['withdraws']);
            this.currentTotalWithDrawSubject.next(res['data']['total_count']);
        })
    }

    public getList(sort: string='id', order: string='desc', page: number=0,limit:number=20)
    {
        const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
        return this.Http.get<WithDraw[]>(`${environment.apiUrl}/api/v1/withdraws/all${queryUrl}`);
    }
    
    public getDashboardList(sort: string='id', order: string='desc', page: number=0,limit:number=20){
        const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
        return this.Http.get<IWithDraw>(`${environment.apiUrl}/api/v1/withdraws/dashboard/all${queryUrl}`);
    }
    public get currentListWithDrawValue(){
        return this.currentListWithDrawSubject.value;
    }

    public getBlance(){
        return this.Http.get<WithDraw[]>(`${environment.apiUrl}/api/v1/withdraws/blance`);
    }

    public addWithDraw(amount:number){
        return this.Http.post<any>(`${environment.apiUrl}/api/v1/withdraws/add`,{amount:amount});
    }

    public reject(id:string){
        return this.Http.put<any>(`${environment.apiUrl}/api/v1/withdraws/reject`,{id:[id]});
    }

    public approved(id:string){
        return this.Http.put<any>(`${environment.apiUrl}/api/v1/withdraws/approved`,{id:[id]});
    }

    public rejectList(id:String[])
    {   
        id.pop();
        return this.Http.put<any>(`${environment.apiUrl}/api/v1/withdraws/reject?type=list`,{id:id});
    }
     
    public approvedList(id:String[]){
        id.pop();
        return this.Http.put<any>(`${environment.apiUrl}/api/v1/withdraws/approved?type=list`,{id:id});
    }

    public delete(id:string){
        return this.Http.put<any>(`${environment.apiUrl}/api/v1/withdraws/delete`,{id:[id]});
    }

    public deleteList(id:String[]){
        id.pop();
        return this.Http.put<any>(`${environment.apiUrl}/api/v1/withdraws/delete?type=list`,{id:id});
    }

    public update 


}