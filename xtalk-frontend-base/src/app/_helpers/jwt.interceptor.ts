import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { AlertService } from '@/_servies/alert.service';
import { LoadingServiceService } from '@/_servies/loading-service.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { User } from '@/_models';
import { LocalstorageService } from '@/_servies/localstorage.service';

import { AppComponent } from '../app.component'
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    canAddToken: Boolean = false;
    constructor(private localStorage: LocalstorageService, private authenticationService: AuthenticationService, private loadingService: LoadingServiceService, private alertService: AlertService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method == 'POST' || request.method == 'PUT' || request.params.has('loading')) {
            if (request.params.has('loading')) {
            }
            this.loadingService.setLoading(true, request.url);
        }
        let currentUser = localStorage.getItem('currentUser');
        let currentUserObj = currentUser != '' ? new User().deserialize(JSON.parse(currentUser)) : null;
        if (currentUser && currentUserObj.access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUserObj.access_token}`
                }
            });
        }
        
        return next.handle(request)
            .pipe(catchError((err) => {
                this.loadingService.setLoading(false, request.url);
              //  this.alertService.error(err);
                return throwError(err);
            }))
            .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
                if (evt instanceof HttpResponse) {
                    this.loadingService.setLoading(false, request.url);
                }
                return evt;
            }));
    }
}