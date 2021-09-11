import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, config } from 'rxjs';
import { map,finalize } from 'rxjs/operators';
//import { CallService} from './call.service';
import { User, Config, Ads } from '@/_models';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { LocalstorageService } from './localstorage.service';

@Injectable({
    providedIn: 'root'
})
export class PageconfigService {
    private currentConfigSubject: BehaviorSubject<Config>;
    public currentConfig: Observable<Config>;
    private currentAdsSubject: BehaviorSubject<Ads>;
    public currentAds: Observable<Ads>;
    constructor(private http: HttpClient, private router: Router, private alertService: AlertService,private localStorage:LocalstorageService) {
        // var tempStorage=this.localStorage.getItem('config');
        // if(tempStorage)
        // {
        //     this.currentConfigSubject = new BehaviorSubject<Config>(new Config().deserialize(tempStorage));
        //     this.currentConfig = this.currentConfigSubject.asObservable();
        // }
        // else
        // {
            this.currentConfigSubject = new BehaviorSubject<Config>(null);
            this.currentConfig = this.currentConfigSubject.asObservable();
            this.getConfig();
       // }
       
        this.currentAdsSubject = new BehaviorSubject<Ads>(new Ads());
        this.currentAds = this.currentAdsSubject.asObservable();
    }

    public get currentConfigValue(): any {
        return this.currentConfigSubject.value;
    }
    public get currentAdsValue(): any {
        return this.currentAdsSubject.value;
    }
    getConfig() {
        this.http.get<Config>(`${environment.apiUrl}/api/v1/page-config/`).subscribe(data=>{
                this.localStorage.setItem('config', JSON.stringify(data['data']));
                this.currentConfigSubject.next(new Config().deserialize(this.localStorage.getItem('config')));
                return data['data'];
            },err=>{
                console.log('errr');
            });
    }

    updateConfig(file: File, config: any) {
        let formData = new FormData();
        formData.append('logo', file);
        formData.append('pageconfig', JSON.stringify(config));
        return this.http.put<Config>(`${environment.apiUrl}/api/backend/config/`, formData);

    }

    reload() {
        this.http.get<Config>(`${environment.apiUrl}/api/v1/page-config/`).subscribe(data=>{
            this.localStorage.setItem('config', JSON.stringify(data['data']));
            this.currentConfigSubject.next(new Config().deserialize(this.localStorage.getItem('config')));

            return data['data'];
        },err=>{
            console.log('errr');
        });
    }

    getAds() {
        var ads=new Ads();
        return this.http.get<any>(`${environment.apiUrl}/api/v1/ads/`)
            .pipe(map(data => {
                var listAds=data['data'];
                listAds.forEach((adsItem,index)=> {
                    if(adsItem.postion == 'top')
                    {
                        ads.header.push(adsItem);
                    }
                    
                    if(adsItem.postion == 'footer')
                    {
                        ads.footer.push(adsItem);
                    }
                    if(index==listAds.length -1){
                        return ads;
                    }
                    
                });
            }),finalize(() => {
                this.currentAdsSubject.next(ads);
            })).subscribe(data=>{
            });
            
    }

    getStaticPage(slug:string){
        return this.http.get<any>(`${environment.apiUrl}/api/v1/static-page/?slug=`+slug);
    }

    getListStaticPage()
    {
        return this.http.get<any>(`${environment.apiUrl}/api/v1/static-page/all`);
    }

    deleteStaticPage(id:string)
    {
        return this.http.delete<any>(`${environment.apiUrl}/api/backend/static-page/${id}`);
    }

    uploadsFavicon(file:File)
    {
        let formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${environment.apiUrl}/api/backend/upload/`,formData);
    }
}
