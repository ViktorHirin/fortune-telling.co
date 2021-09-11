import { Component,OnInit, ViewChild,AfterViewInit  } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatCheckbox, MatButton, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { UserService, AlertService ,PageconfigService} from '@/_servies';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {DashboardService} from '@/modules/dashboard.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.css']
})
export class PayoutsComponent implements OnInit {

  listPayouts = new MatTableDataSource<any>([]);
  resultsLength:number=0;
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  commission:Number=0;
  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private userService: UserService,
    private pageConfig:PageconfigService) {
    this.pageConfig.currentConfig.subscribe(data=>{
      if(data && data.price)
      {
        this.commission=data.price;
      }
      else
      {
        this.commission=10;
      }
    })
    this.dashboardService.getListPayout().subscribe(data=>{
    this.listPayouts=new MatTableDataSource<any>(data.data);
    },
    error=>{
      this.alertService.error('Error');
    })
  }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['name', 'email', 'token', 'reject','pending','commission' ,'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit()
  {
    this.listPayouts.paginator = this.paginator;
    this.listPayouts.sort = this.sort;
    this.dashboardService.currentListPayout.subscribe(data => {
      if (data != null) {
        this.listPayouts = new MatTableDataSource<any>(data.data);
        this.listPayouts.sort = this.sort;
      }
    })
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
          return this.dashboardService.getListPayout(
           this.sort.active, this.sort.direction, this.paginator.pageIndex,this.paginator.pageSize);
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
      ).subscribe(data => this.listPayouts.data=data);
  }

  details(id:string=null)
  {
    location.pathname='/dashboard/payout/payout-detail/'+id;
  }

}
