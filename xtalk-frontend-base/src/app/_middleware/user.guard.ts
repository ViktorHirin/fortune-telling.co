import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree , CanActivate,Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '@/_servies/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authentication:AuthenticationService,private router:Router){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot) {
      if(this.authentication.currentUserValue){
        return true;
      }
      else{
        return this.router.createUrlTree(

          ['/login'], { queryParams: {returnUrl: state.url} }
          // { skipLocationChange: true }
        );
      }
  };

}
