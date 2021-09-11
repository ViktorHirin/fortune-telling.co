import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdsService {
    constructor(private http: HttpClient) { }
    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/api/backend/ads/${id}`);
    }

    active(id: any) {
        return this.http.put<any>(`${environment.apiUrl}/api/backend/ads/active/${id._id}`,{ads:id});
    }
    deActive(id: string) {
        return this.http.get<any>(`${environment.apiUrl}/api/backend/ads/de-active/${id}`);
    }
}