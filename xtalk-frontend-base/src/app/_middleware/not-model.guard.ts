import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree , CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '@/_servies/authentication.service';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class NotModelGuard implements CanActivate {
  constructor(private authentication:AuthenticationService){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<boolean> | boolean {
    if(this.authentication.currentUserValue && this.authentication.currentUserValue.role === "model"){
      return false;
    }
    else{
      return false;
    }
  };
}
