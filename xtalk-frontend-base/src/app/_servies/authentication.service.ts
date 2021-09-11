import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import { CallService} from './call.service';
import { User } from '@/_models';
import { environment } from '../../environments/environment';
import { Router} from '@angular/router';
import { LocalstorageService } from './localstorage.service';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>=new BehaviorSubject<User>(null);
    public currentUser: Observable<User>=this.currentUserSubject.asObservable();
    private currentAdminSubject: BehaviorSubject<User>=new BehaviorSubject<User>(null);
    public currentAmin: Observable<User>;

  constructor(private http: HttpClient, private router: Router, private localStorage: LocalstorageService) {
    LocalstorageService.isBrowser.subscribe(data => {
      if (data) {
        this.currentUser = this.currentUserSubject.asObservable();
        //this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.localStorage.getItem('currentUser')));  
        this.currentUserSubject.next(new User().deserialize(JSON.parse(this.localStorage.getItem('currentUser'))));
        this.currentAdminSubject = new BehaviorSubject<User>(JSON.parse(this.localStorage.getItem('admin')));
        this.currentAmin = this.currentAdminSubject.asObservable();
      }
      else {
        this.currentUserSubject = new BehaviorSubject<User>(null);
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentAdminSubject = new BehaviorSubject<User>(null);
        this.currentAmin = this.currentAdminSubject.asObservable();
      }
    });

  }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    public get currentAdminValue(): User {
        return this.currentAdminSubject.value;
    }

    login(email:string, password:string) {
        email=email.trim();
        email=email.toLowerCase();
        return this.http.post<any>(`${environment.apiUrl}/api/v1/user/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(user && user.data)
                {
                    localStorage.removeItem('currentUser');
                    this.localStorage.setItem('currentUser', JSON.stringify(user.data));
                    this.localStorage.removeItem('admin');
                    this.currentUserSubject.next(new User().deserialize(user.data));
                    if(user.data.role =='admin')
                    {
                      console.log(this.currentAdminValue)
                        this.currentAdminSubject.next(new User().deserialize(user.data));
                         console.log(this.currentAdminValue)
                    }
                }
                return user;
            }));
    }

    updateUser(user:User){
        this.localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);

    }

    logout() {
        // remove user from local storage and set current user to null
        this.localStorage.removeItem('currentUser');
        this.localStorage.removeItem('twilioToken');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
    logoutAdmin() {
        // remove user from local storage and set current user to null
        this.localStorage.removeItem('currentUser');
        this.localStorage.removeItem('twilioToken');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login/dashboard']);

    }

    reload(){
        if(this.currentUserValue && this.currentUserValue.access_token)
        {
            return this.http.get<any>(`${environment.apiUrl}/api/v1/user/me/info`).subscribe(user=>{
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                //this.localStorage.removeItem('admin');
                if(user.data != null)
                {
                    this.localStorage.setItem('currentUser', JSON.stringify(user.data));
                    this.currentUserSubject.next(new User().deserialize(user.data));
                    if(user.data.role == 'admin'){
                      this.currentAdminSubject.next(new User().deserialize(user.data));
                      console.log(this.currentAdminValue)
                    }
                }
            
        },err=>{
                console.log(err);
            });
        }
    }

    forgotPassword(email:string)
    {
        return this.http.post<any>(`${environment.apiUrl}/api/v1/member/forgot-password`,email);
    }    

    validPasswordToken(token:any)
    {
        return this.http.get<any>(`${environment.apiUrl}/api/v1/member/verify-password-token/${token.resettoken}`);
    }

    newPassword(body)
    {
        return this.http.post<any>(`${environment.apiUrl}/api/v1/member/verify-password-reset/${body.resettoken}`,body);
    }

    loginAsAdmin(email:string, password:string)
    {
        return this.http.post<any>(`${environment.apiUrl}/api/backend/user/login`, { email, password })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if(user && user.data)
            {
                this.localStorage.setItem('currentUser', JSON.stringify(user.data));
                this.currentUserSubject.next(new User().deserialize(user.data));
                this.currentAdminSubject.next(new User().deserialize(user.data));
                return user;
            }
        }));
    }

    isAdmin(){
        let admin=this.localStorage.getItem('currentUser');
        if(admin)
        {
            let adminJson=JSON.parse(admin);
            if(adminJson && adminJson.role == 'admin')
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
        
    }


}