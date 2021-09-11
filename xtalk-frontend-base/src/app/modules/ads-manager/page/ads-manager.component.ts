import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator,  MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EditAdsComponent } from '@/shared/widgets/edit-ads/edit-ads.component';
import { ConfirmModalComponent } from '@/shared/widgets/confirm-modal/confirm-modal.component';
import { MatSort } from '@angular/material/sort';
import { AdsService, AlertService } from '@/_servies';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DashboardService } from '@/modules/dashboard.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-ads-manager',
  templateUrl: './ads-manager.component.html',
  styleUrls: ['./ads-manager.component.css']
})
export class AdsManagerComponent implements OnInit {
  baseUrl = environment.apiUrl + '/'
  listAds = new MatTableDataSource<any>([]);
  resultsLength: number = 0;
  isRateLimitReached: Boolean = false;
  isLoadingResults: Boolean = false;
  loadingData: Boolean = false;
  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private http: HttpClient,
    private alertService: AlertService,
    private adsService: AdsService) {

  }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['title', 'postion', 'type', 'preview', 'status', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/api/backend/ads/`).subscribe(data => {
      this.listAds = new MatTableDataSource<any>(data.data);
      this.loadingData = true;
    }, err => {
      this.alertService.error('Errors');
    })
    this.listAds.paginator = this.paginator;
    this.listAds.sort = this.sort;
    this.dashboardService.currentListOrder.subscribe(data => {
      if (data != null) {
        this.listAds = new MatTableDataSource<any>(data.data);
        this.listAds.sort = this.sort;
      }
    })
  }

  ngAfterViewInit() {
    this.listAds.sort = this.sort;
    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.dashboardService.getListOrder();
          //    this.sort.active, this.sort.direction, this.paginator.pageIndex,this.paginator.pageSize);
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
      ).subscribe(data => this.listAds.data = data);
  }

  update(ads: any = null) {
    const dialogRef = this.dialog.open(EditAdsComponent, {
      width: '90%',
      data: ads
    });
    dialogRef.afterClosed().subscribe(results => {
      this.http.get<any>(`${environment.apiUrl}/api/backend/ads/`).subscribe(data => {
        this.listAds = new MatTableDataSource<any>(data.data);
        this.loadingData = true;
      }, err => {
        this.alertService.error('Errors');
      })
    })
  }

  openConfirmDialog(id: any, title: string, action: string): void {
    var tmp = false;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: { title: title, yes: true, no: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (action) {
          case 'delete':
            this.adsService.delete(id).subscribe(data => {
              this.listAds.data.forEach((item, index, object) => {
                if (item._id == id) {
                  this.listAds.data.splice(index, 1);
                }
              });
              this.listAds.data = this.listAds.data;
              this.alertService.success('Success');
            },
              err => {
                this.alertService.error("Failed");
              });
            break;
          case 'active':
            this.adsService.active(id).subscribe(data => {
              this.listAds.data.map((item, index) => {
                item.isActive = false;
                if (item._id == id._id) {
                  this.listAds.data[index].isActived = true;
                  this.listAds.data = this.listAds.data;
                  return;
                }
              });
              this.alertService.success('Success');
            },
              err => {
                this.alertService.error("Failed");
              });
            break;
          case 'de-active':
            this.adsService.deActive(id).subscribe(data => {
              this.listAds.data.map((item, index) => {
                if (item._id == id) {
                  this.listAds.data[index].isActived = false;
                  this.listAds.data = this.listAds.data;
                  return;
                }
              });
              this.alertService.success('Success');
            },
              err => {
                this.alertService.error("Failed", true);
              });
            break;
          default:
            return;
        }

      }
    });
  }



  deActiveAds(assigned: string) {
    var action = 'de-active';
    this.openConfirmDialog(assigned, "Are you sure you want to Deactivate this banner", action);
  }

  activeAds(assigned: any) {
    var action = 'active';
    this.openConfirmDialog(assigned, "Are you sure you want to Activate this banner", action);
  }


  deleteAds(assigned: string) {
    var action = 'delete';
    this.openConfirmDialog(assigned, "Do you want to delete this banner", action);
  }

}
