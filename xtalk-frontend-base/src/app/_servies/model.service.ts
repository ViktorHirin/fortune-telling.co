import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User , Model ,EventSocket} from '@/_models';
import { IModel} from '@/_models/Interface/IModel'
import { Observable ,BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';
import { environment} from '../../environments/environment';
import { AlertService} from './alert.service';
import {AuthenticationService} from './authentication.service';
import {SocketService} from './socket.service';
@Injectable({
  providedIn: 'root'
})
export class ModelService {
  private models:BehaviorSubject<Model[]>;
  public  models$:Observable<Model[]>;
  private currentModel:BehaviorSubject<Model>;
  public currentModel$:Observable<Model>;
  public EventModelOnline = EventSocket.MODELONLINE;
  public EventModelOffline =  EventSocket.MODELONFFLINE;
  constructor(private http: HttpClient,private alertService:AlertService,public socketService:SocketService,private authenticateService:AuthenticationService) 
  { 
    this.models=new BehaviorSubject<Model[]>([]);
    this.models$=this.models.asObservable();
    this.currentModel=new BehaviorSubject<Model>(null);
    this.currentModel$=this.currentModel.asObservable();
    this.getListModels();
//    this.socketService.onEvent(EventSocket.MODELONLINE)
//    .subscribe(data=>{
//      this.setModelOn(data);
//    });
    // set offline model
//    this.socketService.onEvent(EventSocket.MODELONFFLINE)
//    .subscribe(data=>{
//      this.setModelOff(data);
//    });

    // set isClling model
    this.socketService.onEvent(EventSocket.CALLSTART).subscribe(data=>{
      this.modelIsCalling(data);
    })
    // set isCllingOff model 
    this.socketService.onEvent(EventSocket.CALLEND).subscribe(data=>{
      this.modelIsCallingOff(data);
    })

  }
  
 

  getAllModel(sort: string='id', order: string='desc', page: number=0,limit:number=20)
  {
      const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
      return this.http.get<IModel>(`${environment.apiUrl}/api/v1/model/all${queryUrl}`);
  }

  getAllModelasAdmin(sort: string='id', order: string='desc', page: number=0,limit:number=20)
  {
      const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
      return this.http.get<IModel>(`${environment.apiUrl}/api/backend/model/all${queryUrl}`);
  }
  getListModels() {
    //return this.http.get<User[]>(`${config.apiUrl}/user`);
    return this.http.get<Model[]>(`${environment.apiUrl}/api/v1/model`,{
      params:{
        loading:'true'  
      }
    }).pipe(first())
        .subscribe(data => this.models.next(data['data']),err=> this.alertService.error(err.msg));
  }

  public setListModels(data){
    this.models.next(data);
  }

  register(user: User) {
      // return this.http.post(`${config.apiUrl}/user/register`, user);
      return this.http.post(`${environment.apiUrl}/api/v1/model/register`, user);
  }

  delete(id: string) {
      //return this.http.delete(`${config.apiUrl}/user/${id}`);
      return this.http.delete(`${environment.apiUrl}/api/backend/model/${id}`);
  }

  getModelInfo(id){
   return this.http.get<Object>(`${environment.apiUrl}/api/v1/model/${id}`);
  }
  getListModel(size:Number){
    return this.http.get<Model[]>(`${environment.apiUrl}/api/v1/model/?limit=${size}`);
  }
  
  getTwilioToken(){
    return this.http.post<JSON>(`${environment.apiUrl}/api/v1/call/token/generate`,null);
  }

  updateAudio(file:File){
    let data=new FormData();
    data.append('audio',file);
    return this.http.put<any>(`${environment.apiUrl}/api/v1/model/audio`,data);
  }

  updateAudiobyAdmin(file:File,id:string)
  {
    let data=new FormData();
    data.append('audio',file);
    data.append('userId',id);
    return this.http.put<any>(`${environment.apiUrl}/api/v1/model/admin/audio`,data);
  }

  deActiveList(id:string[])
  {
      return this.http.put<any>(`${environment.apiUrl}/api/v1/user/de-active`,{listUser:id});
  }

  activeList(id:string[])
  {
      return this.http.put<any>(`${environment.apiUrl}/api/v1/user/active`,{listUser:id});
  }

  deleteList(id:string[])
  {
      return this.http.put<any>(`${environment.apiUrl}/api/v1/user/delete`,{listUser:id});
  }

  active(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/user/active/${id}`);
  }

  deActive(id: string) {
      return this.http.get<any>(`${environment.apiUrl}/api/v1/user/de-active/${id}`);
  }

  setModelOnOff(models: any, id: string, status) {
    console.log('model '+status);
    let listModels = models;
    listModels.forEach((item, index) => {
      if (listModels[index].id == id) {
        listModels[index].status = status;
        this.models.next(listModels);
      }
    })
    if (this.authenticateService.currentUserValue && this.authenticateService.currentUserValue.id == id && status == false) {
      this.socketService.emitEvent('online', this.authenticateService.currentUserValue.id);
    }
  }

  setModelCallOnOff(models: any, id: string, status) {
    console.log('calling '+status);
    let listModels = models;
    listModels.forEach((item, index) => {
      if (listModels[index].id == id) {
        listModels[index].isCalling = status;
        this.models.next(listModels);
      }
    })

  }
 

  modelIsCalling(id:string)
  {
    let listModels=this.models.value;

    if(this.currentModel.value && this.currentModel.value.id == id)
    {
      this.currentModel.value.isCalling=true;
      this.currentModel.next(this.currentModel.value);
    }
    listModels.forEach((item,index)=>{
      if(listModels[index].id == id)
      {
        listModels[index].isCalling=true;
        this.models.next(listModels);
      }
    })
  }

  modelIsCallingOff(id:string)
  {
    let listModels=this.models.value;
    if(this.currentModel.value && this.currentModel.value.id == id)
    {
      this.currentModel.value.isCalling=false;
      this.currentModel.next(this.currentModel.value);
    }
    listModels.forEach((item,index)=>{
      if(listModels[index].id == id)
      {
        listModels[index].isCalling=false;
        this.models.next(listModels);
      }
    })
  }
  
  public updateCurrentModel(model:Model)
  {
    this.currentModel.next(model);
  }
   
}
