import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {AuthenticationService} from '@/_servies/authentication.service';
import { Chat ,EventSocket} from '@/_models';
import { Observable,Subject,BehaviorSubject} from 'rxjs';
import { environment} from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket:any;
  constructor(private authenticationService:AuthenticationService) 
  {
    this.authenticationService.currentUser.subscribe(data=>{
      if(data && data.access_token)
      {
        this.socket=io(environment.socketUrl,{query:"token="+data.access_token});
      }
      else
      {
        if(data == null && this.socket)
        {
          this.socket.emit('user:disconnect');
        }
        this.socket=io(environment.socketUrl);
      }
    })
  }


  public onEvent(event: EventSocket): Observable<any> {
    return new Observable<EventSocket>(observer => {
        this.socket.on(event, (data) => observer.next(data));
    });
  }

  public emitEvent(event:string,data:any)
  {   
    this.socket.emit(event,data);
  }
}
