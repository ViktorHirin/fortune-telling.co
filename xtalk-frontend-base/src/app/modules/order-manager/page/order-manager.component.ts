import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EditAdsComponent } from '@/shared/widgets/edit-ads/edit-ads.component';
import { MatSort, Sort } from '@angular/material/sort';
import { UserService, AlertService } from '@/_servies';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Order } from '@/_models/order.model';
import { DashboardService } from '@/modules/dashboard.service';
@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {
  listOrders = new MatTableDataSource<Order>([]);
  resultsLength: number = 0;
  isRateLimitReached: Boolean = false;
  isLoadingResults: Boolean = false;
  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private userService: UserService) {
    this.listOrders = new MatTableDataSource<Order>([]);
    this.dashboardService.getListOrder().subscribe(data => {
      //this.resultsLength = data.total_count||0;
      this.listOrders.data = data.data || [];
      this.listOrders.paginator = this.paginator;
      this.listOrders.sort = this.sort;

    })
  }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['name', 'email', 'token', 'date'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.listOrders.sort = this.sort;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.dashboardService.getListOrder(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
      ).subscribe(data => this.listOrders.data = data);
  }

  update(id: string = null) {
    this.dialog.open(EditAdsComponent, {
      width: '90%',
      id: id
    });
  }

  applyFilter(filterValue: string) {
    const sortState: Sort = { active: 'email', direction: 'desc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.paginator.pageSize = 500;
    this.listOrders.filter = filterValue.trim().toLowerCase();
  }
}
