import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@/_models';
import {IUser} from '@/_models/Interface/IUser';
import { environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAllUser(sort: string='id', order: string='desc', page: number=0,limit:number=20)
    {
        const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;
        //return this.http.get<User[]>(`${config.apiUrl}/user`);
        return this.http.get<IUser>(`${environment.apiUrl}/api/v1/user/${queryUrl}`);
    }

    getAllUserasAdmin(sort: string='id', order: string='desc', page: number=0,limit:number=20)
    {
        const queryUrl =`?&sort=${sort}&order=${order}&page=${page + 1}&limit=${limit}`;;
        return this.http.get<IUser>(`${environment.apiUrl}/api/backend/user/${queryUrl}`);
    }

    register(user: User) {
       // return this.http.post(`${config.apiUrl}/user/register`, user);
       return this.http.post<any>(`${environment.apiUrl}/api/v1/user/register`, user);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/v1/user/${id}`);
    }

    active(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/api/v1/user/active/${id}`);
    }
    deActive(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/api/v1/user/de-active/${id}`);
    }

    updateProfile(file:File,user:User){
        let data=new FormData();
        data.append('avatar',file);
        data.append('user',JSON.stringify(user));
        return this.http.put<any>(`${environment.apiUrl}/api/v1/user/me`,data);
    }

    updateProfileasAdmin(avatar:File,user:User){
        let data=new FormData();
        data.append('avatar',avatar);
        data.append('user',JSON.stringify(user));
        return this.http.put<any>(`${environment.apiUrl}/api/backend/user/update/profile`,data);
    }
    
    registerModel(file:File,user:User){
        let data=new FormData();
        data.append('audio',file);
        data.append('user',JSON.stringify(user));
        console.log(data);
        return this.http.put<any>(`${environment.apiUrl}/api/v1/user/register/model`,data);
    }

    forgetPassword(email:String){
        return this.http.post<string>(`${environment.apiUrl}/api/v1/user/reset-password`,{email:email});
    }

    changePassword(user:Object){
        return this.http.put<any>(`${environment.apiUrl}/api/v1/user/change-password`,{user:user});
    }

    changePasswordasUser(user:Object){
        return this.http.put<any>(`${environment.apiUrl}/api/v1/user/me/change-password`,{user:user});
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

}