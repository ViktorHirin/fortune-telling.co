import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class NewsLetterService {
  
    constructor(private http: HttpClient) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
       
    }

    register(email){
      return this.http.post(`${environment.apiUrl}/api/v1/news-letters`,{email:email});
    }
    // enable subscribing to alert
   
   
}
