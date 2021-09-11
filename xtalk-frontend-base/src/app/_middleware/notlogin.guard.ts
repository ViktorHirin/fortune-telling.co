import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree , CanActivate,Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '@/_servies/authentication.service';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class NotloginGuard implements CanActivate  {
  constructor(private authentication:AuthenticationService,private router:Router){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot) {
      if(!this.authentication.currentUserValue)
      {
        return true;
      }
      else
      {
        if(this.authentication.currentUserValue && this.authentication.currentUserValue.access_token)
        {
          return this.router.createUrlTree(

            [state.url,{ message: 'you do not have the permission to enter' }], { queryParams: {returnUrl: state.url} }
            // { skipLocationChange: true }
          );
        }
        return true;
      }
  };
}
