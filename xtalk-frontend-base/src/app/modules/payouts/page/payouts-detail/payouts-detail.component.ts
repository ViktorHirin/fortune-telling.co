import { Component, OnInit , ViewChild,AfterViewInit } from '@angular/core';
import {  ActivatedRoute, Router,NavigationEnd} from '@angular/router';
import { UserService, AlertService ,PageconfigService} from '@/_servies';
import { Alert } from '@/_models';
import { MatTableDataSource, MatPaginator, MatCheckbox, MatButton, MatDialog,MatSort } from '@angular/material';
import { environment} from 'environments/environment'
import { HttpClient } from '@angular/common/http';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-payouts-detail',
  templateUrl: './payouts-detail.component.html',
  styleUrls: ['./payouts-detail.component.css']
})
export class PayoutsDetailComponent implements OnInit {
  id:String;
  userInfo;
  resultsLength:Number=0;
  listPayouts = new MatTableDataSource<any>([]);
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  displayedColumns: string[] = ['date' ,'amount'];
  constructor(
    private ConfigService:PageconfigService,
    private http:HttpClient,
    private route:Router,
    private alertService:AlertService,
    private activeRouter:ActivatedRoute
  )
  {
    this.activeRouter.params.subscribe(params => {
      this.id = params['id'];
      });

  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() 
  {
    this.loadData(this.id);
  }

  private loadData(id:String)
  {
    this.http.get<any>(`${environment.apiUrl}/api/backend/payout/detail/${id}`).subscribe(data=>{
      this.listPayouts= new MatTableDataSource<any>(data.data);
    })

    this.http.get<any>(`${environment.apiUrl}/api/v1/user/${id}`).subscribe(reponse=>{
      this.userInfo=reponse.data[0];
    },err=>{
      this.route.navigate(['/home']);
    });
  }

  ngAfterViewInit()
  {
    this.listPayouts.sort = this.sort;
    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.http.get<any>(`${environment.apiUrl}/api/backend/payout/detail/${this.id}`);
        }),
        map(data => {

          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;
          return data.data;
        }),
        catchError(() => {
          this.isLoadingResults = false;

          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.listPayouts.data = data);
  }

}
