import { Injectable } from '@angular/core';
import { HttpClient} from  '@angular/common/http';  
import { map } from  'rxjs/operators';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  SERVER_URL: string = environment.uploadUrl;  
  constructor(private httpClient: HttpClient) { }
  public upload(formData) {

    return this.httpClient.post<any>(this.SERVER_URL, formData, {  
        reportProgress: true,  
        observe: 'events'  
      });  
  }
}
