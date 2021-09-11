import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Model, CallHistory,EventSocket } from '@/_models';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AcceptCallService ,} from '@/_servies/acceptCall.service';
import {SocketService } from './socket.service';
import {AlertService} from './alert.service';
import {PageconfigService} from './pageconfig.service';
import {ModelService} from './model.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { ModalService } from '@/_modal/modal.service';
import { environment } from '../../environments/environment';
import { LocalstorageService } from './localstorage.service';
import { MatDialog } from '@angular/material';
import { RatingCallComponent } from '@/shared/widgets/rating-call/rating-call.component';
declare const Twilio;
@Injectable({
  providedIn: 'root'
})
export class CallService {
  private twilioTokenSubject: BehaviorSubject<string>;
  public currentTwilioToken: Observable<string>;
  private otherPerson: BehaviorSubject<Model>;
  public otherPerson$: Observable<Model>;
  public fromName:String;
  public isCaller:boolean=true;
  public availMin:number;
  private _EndCall=new Subject();
   _EndCall$=this._EndCall.asObservable();
  private _AcceptCall=new Subject();
  _AcceptCall$=this._AcceptCall.asObservable();
  private remainingTime  :BehaviorSubject<number>;
  public remainingTime$  :Observable<number>;
  private resetCallDuration: BehaviorSubject<any>;
  public resetCallDuration$: Observable<Model>;
  private user: User;
  public type:string;
  public callId;
  private params:any;
  private _StartCall=new Subject();
  _StartCall$=this._StartCall.asObservable();
 
  constructor(private http: HttpClient, private modelService: ModelService,
    private alertService: AlertService, private modalService: ModalService,
    private localStorage:LocalstorageService,public dialog: MatDialog,
    private pageConfigService:PageconfigService,private socketServivce:SocketService,
    private acceptCallService: AcceptCallService, private authentication: AuthenticationService
  ) {
    //this.reloadTwilio();
    this.remainingTime=new BehaviorSubject<number>(0);
    this.remainingTime$=this.remainingTime.asObservable();
    this.otherPerson = new BehaviorSubject<Model>(new Model());
    this.otherPerson$ = this.otherPerson.asObservable();
    this.twilioTokenSubject = new BehaviorSubject<string>(this.localStorage.getItem('twilioToken'));
    this.currentTwilioToken = this.twilioTokenSubject.asObservable();
    this.user = this.authentication.currentUserValue;
    this.resetCallDuration = new BehaviorSubject<any>({});
    this.resetCallDuration$ = this.resetCallDuration.asObservable();
    this.authentication.currentUser.subscribe(data => {
      this.user = data;
      if(this.user)
      {
        this.pageConfigService.currentConfig.subscribe(data=>{
          if(data)
          {
            this.remainingTime.next(Math.floor(this.user.token/this.pageConfigService.currentConfigValue.price));
            
          }
        })
      }
    });
    this.currentTwilioToken.subscribe(data => {
      this.initalTwilioSetup();
    })
    this.twilioTokenSubject.next(this.localStorage.getItem('twilioToken'));
    this.initalTwilioSetup();
    this.getTimmer();
    this.setUpSocketEvent();
  }
  getAllHistory() {
    return this.http.get<CallHistory[]>(`${environment.apiUrl}/api/v1/call/history`);
  }

  getAllHistoryofModel() {
    return this.http.get<CallHistory[]>(`${environment.apiUrl}/api/v1/call/model/history`);
  }

  public initalTwilioSetup() {
    if (this.twilioTokenSubject.value != null) {
      this.setupTwilio();
    }
  }

  private setupTwilio() {
    Twilio.Device.setup(this.twilioTokenSubject.value, { debug: true });

    Twilio.Device.ready((device) => {
      console.log('Twilio.Device Ready!');
      //this.modalService.open('reviced-call');
    });
    Twilio.Device.on('offline', (device) => {
      if (this.user != null) {
        this.reloadTwilio();
      }
    })
    Twilio.Device.error((error) => {
      Twilio.Devices.activeConnection();
      Twilio.Device.disconnectAll();
      // this.alertService.error('Twilio.Device Error: ' + error.message);
      this.modalService.closeAll();


    });

    Twilio.Device.connect((conn) => {
      this.otherPerson$.subscribe(data => {
        if (data == null) {
          //conn.reject();
          conn.disconnect();
          this.modalService.closeAll();
        }
      });
      this.callId=conn.parameters.CallSid
    });

    Twilio.Device.on('disconnect', (conn) => {
      conn.reject(() => { });
      if(this.callId != conn.parameters.CallSid)
      {
        this._EndCall.next({
          lastCallId:this.callId,
          currentCallId:conn.parameters.CallSid,
        });
      }
      this.callId=conn.parameters.CallSid;
      this.otherPerson.next(null);
      this.modalService.closeAll();
      this.type=null;
      this.resetCallDuration.next({ action: 'reset_call_duration' });
      if(this.user.role=='member')
      {
        this.socketServivce.emitEvent(EventSocket.CALLEND,{
          From:this.user.id,
          To:conn.message.To,
        });
        this.openRatingDialog();
      }
      setTimeout(()=>{
        this.authentication.reload();
      },1000);

    });

    Twilio.Device.on('incoming', (conn) => {
      this.modalService.open('reviced-call');
      console.log('Incoming connection from ' + conn.parameters.From);
      conn.accept(function () {
      });
      this._AcceptCall$.subscribe(() => {
        this.type="inbound";
        this.callId = conn.parameters.CallSid;
        conn.accept();
      }
      );
      this.fromName=conn.message.fromName;
      this.availMin=conn.message.availMin;
      this.otherPerson.next(conn.parameters);
      this._EndCall$.subscribe(data => {
          conn.reject();
          //conn.disconnect();
          conn.disconnect();
      });
    });
    Twilio.Device.on('cancel', (connection) => {
      this.otherPerson.next(null);
      this.modalService.closeAll();
      Twilio.Device.activeConnection();
    })


  }

  private openRatingDialog() {
    if (this.type == 'outbound') {
      this.getCallInfo().subscribe(data => {
        const response = data['data'];
        if (response && response.callStatus == 'completed') {
          const dialoagRef = this.dialog.open(RatingCallComponent, {
            width: "500px",
            data: {
              callId: this.callId,
              me: this.user,
              id: response._id,
            }
          });
        }
      }, error => {
        console.log(error);
      })

    }
  }
  public updateTwilioToken(token: string) {
    this.twilioTokenSubject.next(token);
  }


  public reloadTwilio() {
    this.modelService.getTwilioToken()
      .subscribe(
        data => {
          let s = JSON.stringify(data['token']);
          var twilioToken = s.slice(1, s.length - 1);
          this.localStorage.setItem('twilioToken', twilioToken);
          this.twilioTokenSubject.next(twilioToken);
        }
        ,
        error => {
          //this.alertService.error("Invalid security token; please reload the page and try again");
        });
  }

  public getTwilioToken(): string {
    return this.twilioTokenSubject.value;
  }

  public acceptCall() {
    this._AcceptCall.next();
  }

  public call(to: Model) {
    if(this.user!=null && to != null)
    {
      if(to.id != this.user.id)
      {
        this.otherPerson.next(to);
        let params = {
          To: to.id,
          From: this.user.id
        };
        this.makeCall(params);
      }
      else
      {
        this.alertService.error("You cannot make outgoing calls  to yourself.");
      }
    }
    else
    {
      this.alertService.error("Signup/Login to call the model");
    }
    
  }

  private makeCall(params: any) {
    this.type="outbound";
    this.params=params;
    this.setUpTwilioConnect(Twilio.Device.connect(params));
    this.socketServivce.emitEvent(EventSocket.CALLSTART ,params);
  }

  public endCall() {
    console.log("run endCall on CallService");
    this._EndCall.next(null);
    
    this.modalService.closeAll();
    Twilio.Device.disconnectAll();
  }


  public setUpTwilioConnect(conn) {
    conn.on('cancel', () => {
      // this.modalService.closeAll();

    })

    conn.on('disconnect', () => {
      // make alert when connection disconnect
    })

    conn.on('error', (error) => {
      this.alertService.error(error.message, false, true);
    })
    conn.on('accept', (connection)=>{
      this._StartCall.next(true);
    })
  }

  get  getType(){
    return this.type;
  }

  public getCallInfo(){
    return this.http.get<any[]>(`${environment.apiUrl}/api/v1/call/info?callId=${this.callId}&from=${this.params.From}&to=${this.params.To}`);
  }

  public updateTimer()
  {
    if(this.pageConfigService && this.pageConfigService.currentConfigValue)
    {
      if(this.remainingTime.value <= 0)
      {
        this.remainingTime.next(0);
      }
      else
      {
        this.remainingTime.next(this.remainingTime.value - 1);
      }
    }
    console.log('run update Timmer in call service ' + this.remainingTime.value);
  }
  private getTimmer()
  {
    return this.remainingTime.value;
  }

  private setUpSocketEvent()
  {
    this.socketServivce.onEvent(EventSocket.CALLSTART).subscribe(data=>{
      this.modelService.modelIsCalling(data);
    })

    this.socketServivce.onEvent(EventSocket.CALLEND).subscribe(data=>{
      this.modelService.modelIsCallingOff(data);
    })
  }

  
}



