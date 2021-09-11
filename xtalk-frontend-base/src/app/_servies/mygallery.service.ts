import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gallery} from '@/_models';
import { environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MyGalleryService {
  
  constructor(private http: HttpClient) { }

  getGallery(id:String)
  {
    return this.http.get<Gallery[]>(`${environment.apiUrl}/api/v1/gallery/${id}`);
  }

  postGallery(file:File,id:string)
  {
    let data=new FormData();
    data.append('image',file);
    data.append('user',id);
    return this.http.put<any>(`${environment.apiUrl}/api/v1/gallery/`,data); 
  }

  deleteGallery(id:string)
  {
    return this.http.delete<Gallery[]>(`${environment.apiUrl}/api/v1/gallery/${id}`); 
  }

  removeMutiGallery(listId:[])
  {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/gallery/remove`,listId); 
  }
}