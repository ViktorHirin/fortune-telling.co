import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map,finalize } from 'rxjs/operators';
//import { CallService} from './call.service';
import { ISeo} from '@/_models/Interface/ISeo';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { JsonPipe } from '@angular/common';
import { LocalstorageService } from './localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class SeoConfigService {
  seoConfig:ISeo;
  private currentSeoSubject: BehaviorSubject<ISeo>;
    public currentSeo: Observable<ISeo>;
    constructor(private http: HttpClient, private router: Router, private alertService: AlertService,private localStorage:LocalstorageService) {
        var tempStorage=this.localStorage.getItem('seo');
        if(tempStorage)
        {
            this.seoConfig=JSON.parse(tempStorage);
            this.currentSeoSubject = new BehaviorSubject<ISeo>(this.seoConfig);
            this.currentSeo = this.currentSeoSubject.asObservable();
        }
        else
        {
            this.currentSeoSubject = new BehaviorSubject<ISeo>(null);
            this.currentSeo = this.currentSeoSubject.asObservable();
            this.getSeoConfig();
        }
       
    }

    public get currentSeoValue(): any {
        return this.currentSeoSubject.value;
    }

    getSeoConfig() {
        this.http.get<ISeo>(`${environment.apiUrl}/api/v1/page-config/seo`).subscribe(data=>{
                this.localStorage.setItem('seo_config', JSON.stringify(data['data']));
                this.seoConfig=data['data'];
                this.currentSeoSubject.next(this.seoConfig);
                return data['data'];
            },err=>{
                console.log(err);
            });
    }

    updateSeoConfig(data:ISeo) {
        return this.http.put<ISeo>(`${environment.apiUrl}/api/backend/config/seo`, data);

    }

    reload() {
        this.http.get<ISeo>(`${environment.apiUrl}/api/v1/page-config/seo`).subscribe(data=>{
            this.localStorage.setItem('ISeo', JSON.stringify(data['data']));
            this.seoConfig=data['data'];
            this.currentSeoSubject.next(this.seoConfig);

            return data['data'];
        },err=>{
            console.log('errr');
        });
    }
}
