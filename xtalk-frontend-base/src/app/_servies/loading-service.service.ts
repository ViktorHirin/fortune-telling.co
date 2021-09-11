import { Injectable } from '@angular/core';
import {BehaviorSubject,Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Contains in-progress loading requests
   */
  loadingMap: Map<string, boolean> = new Map<string, boolean>();
  constructor() { }
  setLoading(loading:boolean,url:string)
  {
    if(!url)
    {
      throw new Error("This parameter is mandatory, don't ignore it!")
    }
    if(loading)
    {
      this.loadingMap.set(url,true)
      this.loadingSub.next(true);
    }
    else if(!loading && this.loadingMap.has(url) )
    {
      this.loadingMap.delete(url);
      this.loadingSub.next(false)
    }
    if(this.loadingMap.size == 0)
    {
      this.loadingSub.next(false);
    }

  }

  
}
