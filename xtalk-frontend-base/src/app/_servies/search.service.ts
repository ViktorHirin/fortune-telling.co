import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap ,first} from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    baseUrl = environment.apiUrl+'/api/v1/model/search';
    queryUrl = '?search=';

    constructor(private http: HttpClient) {}

    search(terms: Observable<string>): any {
        return terms.pipe(
            // debounceTime(400): waits until there’s no new data for the provided amount of time
            debounceTime(400),
            // distinctUntilChanged():
            //      will ensure that only distinct data passes through
            //      will only send the data once
            distinctUntilChanged(),
            // switchMap():
            //      combines multiple possible observables received from the searchEntries method into one,
            //      which ensures that we use the results from the latest request only.
            //switchMap((term: string) => this.searchEntries(term))
            switchMap((term: string) => this.searchEntries(term))
        );
    }

    // searchEntries(term): makes a get request to our API endpoint with our search term, this gives us another observable
    searchEntries(term: string): Observable<object> {
        if (term === '') {
            return of({});
        }
        const url = `${this.baseUrl}${this.queryUrl}${term}`;
       
        return this.http.get(url);
    }
    searchWith(terms: Observable<string>,type:string='name'): any {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((term: string) => this.searchEntriesWith(term,type)),
           // take(1)
        );
    }

    // searchEntries(term): makes a get request to our API endpoint with our search term, this gives us another observable
    searchEntriesWith(term: string,type): Observable<object> {
        if (term === '') 
        {
            const url = environment.apiUrl+'/api/v1/model/all';  
            return this.http.get(url);
        }
        else
        {
        let baseUrl = environment.apiUrl+'/api/v1/model/search';
        const url = `${baseUrl}${this.queryUrl}${term}&by=${type}`;
        return this.http.get(url).pipe(first());
        }
        
    }
}