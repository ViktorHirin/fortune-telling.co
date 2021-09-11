import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree , CanActivate ,Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthenticationService} from '@/_servies/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authentication:AuthenticationService,private router:Router){}
  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot) {
      if(this.authentication.isAdmin()){
        return true;
      }
      else
      {
        this.authentication.logoutAdmin();
        return this.router.createUrlTree(

          ['/login/dashboard'], { queryParams: {returnUrl: state.url} }
          // { skipLocationChange: true }
        );
      }
  };
}
