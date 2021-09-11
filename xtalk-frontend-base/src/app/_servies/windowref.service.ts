import { Injectable } from '@angular/core';
import { AppComponent} from '../app.component';
function _window(): any {
  return window;
}
@Injectable()
export class WindowRef {
  constructor(){
    AppComponent.isBrowser.subscribe(isBrowser => {
      if (isBrowser) {
        this._window= _window();
      }
    });
  }
  _window:any;
 get nativeWindow(): any {
   return _window;
 }
}