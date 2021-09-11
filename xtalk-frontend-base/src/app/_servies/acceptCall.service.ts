import { BehaviorSubject, Observable ,Subject} from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AcceptCallService {
    private _toggle = new Subject();
    toggle$ = this._toggle.asObservable();
    private _EndCall=new Subject();
    _EndCall$=this._EndCall.asObservable();


  toggle() {
    this._toggle.next(null);
  }

  endCall(){
    this._EndCall.next();
  }
}