import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '@/_models';
import { environment} from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class XtalkNotificationService {

  constructor(private http: HttpClient) { }

  getAllNoti() 
  {
      return this.http.get<Notification[]>(`${environment.apiUrl}/api/v1/noti/all`);
  }

  delete(id: number) {
      //return this.http.delete(`${config.apiUrl}/user/${id}`);
      return this.http.delete(`${environment.apiUrl}users/${id}`);
  }

  unread(noti:Notification){
      let data=new FormData();
      data.append('noti',JSON.stringify(noti));
      return this.http.post<any>(`${environment.apiUrl}/api/v1/noti/unread`,data);
  }

  
  unreadAll(){
    return this.http.get<any>(`${environment.apiUrl}/api/v1/noti/unread`);
}
}
