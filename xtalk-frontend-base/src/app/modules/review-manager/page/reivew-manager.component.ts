import { Component, OnInit,ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { MatTableDataSource, MatPaginator ,MatCheckbox ,MatButton ,MatDialog} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import { ReviewService, AlertService} from '@/_servies';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ConfirmModalComponent} from '@/shared/widgets/confirm-modal/confirm-modal.component'
@Component({
  selector: 'app-reivew-manager',
  templateUrl: './reivew-manager.component.html',
  styleUrls: ['./reivew-manager.component.css']
})
export class ReivewManagerComponent implements OnInit {

  listReviews=new MatTableDataSource<any>(); 
  resultsLength:number=30;
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  constructor(private dashboardService:DashboardService,
    public dialog: MatDialog,
    private alertService:AlertService,
    private reviewService :ReviewService) {
      this.reviewService.getAllReview().subscribe(data=>{
        if(data!=null){
          this.listReviews=new MatTableDataSource<any>(data.data);
        }
      })
     }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['select','from','to', 'rating', 'content', 'date','action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
     
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listReviews.data.length;
    return numSelected == numRows;
  }
  
  ngAfterViewInit() {
    this.listReviews.sort = this.sort;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.reviewService.getAllReview(
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
      ).subscribe(data => this.listReviews.data = data);
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.listReviews.data.forEach(row => this.selection.select(row));
  }
  HeaderCheckBoxChanged(model: any) {
   // debugger;
    this.assigned = '';
    if (model.checked == true) {
      this.listReviews.data.forEach(d => {
        // d.IsAssigned = true;
        this.assigned += d.id + ',';
      })
    } else {
      this.listReviews.data.forEach(d => {
       // d.IsAssigned = false;
      })
    }
  }

  CheckBoxChanged(model: any, ID: any) {
   // debugger;
    if (model.checked == true) {
      this.assigned = this.assigned + ID + ',';
    } else {
      this.assigned = this.assigned.replace(ID + ',', "");
    }
  }


  deleteReivew(id:string){
    var action='delete';
    this.openConfirmDialog(id,"'Are you sure delete this user");
  }
  openConfirmDialog(id:string,title:string):void {
    var tmp=false;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: {title:title , yes: true,no:false}
    });

    dialogRef.afterClosed().subscribe(result => {     
            this.reviewService.deleteReview(id).subscribe(data=>{ 
              this.listReviews.data.forEach((item,index,object)=>{
                if(item._id==id){
                  this.listReviews.data.splice(index,1);
                }
                
              });
              this.listReviews.data=this.listReviews.data;
              this.alertService.success('The update was successful');
              },error=>{
                this.alertService.error('Faild');
              });
       
      }
    );  
  }

  applyFilter(filterValue: string) {
    this.listReviews.filter = filterValue.trim().toLowerCase();

  }

  public getContentReview(content:string)
  {
    return content.slice(1,100);
  }
}
