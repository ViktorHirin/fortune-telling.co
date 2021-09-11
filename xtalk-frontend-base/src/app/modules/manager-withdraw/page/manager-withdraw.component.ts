import { Component, OnInit,ViewChild ,AfterViewInit} from '@angular/core';
import { MatTableDataSource,MatCheckbox ,MatButton ,MatDialog} from '@angular/material';
import { ConfirmModalComponent} from '@/shared/widgets/confirm-modal/confirm-modal.component';
import {  ChangePasswordComponent} from '@/shared/widgets/change-password/change-password.component';
import { SelectionModel } from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { UserService ,WithDrawService,AlertService} from '@/_servies';
import { WithDraw} from '@/_models';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-manager-withdraw',
  templateUrl: './manager-withdraw.component.html',
  styleUrls: ['./manager-withdraw.component.css']
})
export class ManagerWithdrawComponent implements OnInit {

  listWithDraw=new MatTableDataSource<WithDraw>([]); 
  constructor(private withDrawService:WithDrawService,
    public dialog: MatDialog,
    private alertService:AlertService,
    private userService :UserService) {
      this.listWithDraw=new MatTableDataSource<WithDraw>(null);
      this.withDrawService.currentListWithDraw.subscribe(data=>{
        if(data!=null){
          this.listWithDraw=new MatTableDataSource<WithDraw>(data);
          this.listWithDraw.sort = this.sort;
        }
      })
     }
  selection = new SelectionModel<WithDraw>(true, []);
  assigned: string = '';
  resultsLength:number=30;
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  displayedColumns: string[] = ['select','email','name', 'status','amount','date' ,'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
      this.listWithDraw.paginator=this.paginator;
      this.listWithDraw.sort = this.sort;
      this.withDrawService.getDashboardList();     
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listWithDraw.data.length;
    return numSelected == numRows;
  }
  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() 
  {
    this.isAllSelected() ?
        this.selection.clear() :
        this.listWithDraw.data.forEach(row => this.selection.select(row));
  }
  HeaderCheckBoxChanged(model: any) 
  {
   // debugger;
    this.assigned = '';
    if (model.checked == true) {
      this.listWithDraw.data.forEach(d => {
        // d.IsAssigned = true;
        this.assigned += d._id + ',';
      })
    } else {
      this.listWithDraw.data.forEach(d => {
       // d.IsAssigned = false;
      })
    }
  }

  CheckBoxChanged(model: any, ID: any) 
  {
   // debugger;
    if (model.checked == true) {
      this.assigned = this.assigned + ID + ',';
    } else {
      this.assigned = this.assigned.replace(ID + ',', "");
    }
  }

  approved(id:string)
  {
    var action='approved';
    this.openConfirmDialog(id,"Are you sure you want to Accept withdraw request",action);

  }
  reject(id:string)
  {
    var action='reject';
    this.openConfirmDialog(id,"Are you sure you want to Reject withdraw request",action);

  }
  openConfirmDialog(id:string,title:string,action:string):void 
  {
    var tmp=false;
    const dialogRef = this.dialog.open(ConfirmModalComponent, 
    {
      width: '250px',
      data: {title:title , yes: true,no:false}
    });

    dialogRef.afterClosed().subscribe(result => {
       if(result){
         switch(action){
         case 'approved':
          this.withDrawService.approved(id).subscribe(data=>{
            this.listWithDraw.data.map((item,index)=>{;
              if(item.id==id){
                item.status='approved';
                this.listWithDraw.data[index]=item;
              }
            });
                 this.withDrawService.getDashboardList().subscribe(data => this.listWithDraw.data =data.data);
                 this.alertService.success('The update was successful');
            },
            err=>{
                this.alertService.error('Failed');
            });
           break;
           case 'reject':
              this.withDrawService.reject(id).subscribe(data=>
                {
                this.listWithDraw.data.map((item,index)=>{
                  if(item.id==id){
                    item.status='reject';
                    this.listWithDraw.data[index]=item;
                  
                  }
                });
                this.withDrawService.getDashboardList().subscribe(data => this.listWithDraw.data =data.data);
                this.alertService.success('The update was successful');
                },
                error=>
                {
                  this.alertService.error("Failed");
                });
           break;
           case 'delete':
            this.withDrawService.delete(id).subscribe(data=>{
              this.listWithDraw.data.map((item,index)=>{
                if(item.id==id){
                  this.listWithDraw.data.splice(index,1);
                
                }
              });
              this.alertService.success('The update was successful');
              this.withDrawService.getDashboardList().subscribe(data => this.listWithDraw.data =data.data);
              },
              error=>{
                this.alertService.error("Failed");
              });
         break;
           case 'reject-list':
            var listid=id.split(',');
            this.withDrawService.rejectList(listid).subscribe(data => {
              //this.dashboardService.reloadListUser();
              this.alertService.success('The update was successful');
              this.withDrawService.getDashboardList().subscribe(data => this.listWithDraw.data =data.data);
              
            },
              err => {
                this.alertService.error("Failed",true);
              });
            break;
            case 'approved-list':
            var listid=id.split(',');
            this.withDrawService.approvedList(listid).subscribe(data => {
              //this.dashboardService.reloadListUser();
              this.alertService.success('The update was successful');
              this.withDrawService.getDashboardList().subscribe(data => this.listWithDraw.data =data.data);
              
            },
              err => {
                this.alertService.error("Failed",true);
              });
            break;
            case 'delete-list':
            var listid=id.split(',');
            listid.pop();
            this.withDrawService.deleteList(listid).subscribe(data => {
              //this.dashboardService.reloadListUser();
              this.alertService.success('The update was successful');
              this.withDrawService.getDashboardList().subscribe(data => this.listWithDraw.data =data.data);              
            },
              err => {
                this.alertService.error("Failed",true);
              });
            break;
        default:
          return ;
       }

      }
    });

  }

  rejectList(assigned:string)
  {
    var action='reject-list';
    this.openConfirmDialog(assigned,"Are you sure you want to Reject withdraw request",action);
  }

  approvedList(assigned:string)
  {
    var action='approved-list';
    this.openConfirmDialog(assigned,"Are you sure you want to Approved withdraw request",action);
  }

  deleteList(assigned:string)
  {
    var action='delete-list';
    this.openConfirmDialog(assigned,"Are you sure you want to Delete withdraw request",action);
  }

  delete(id:string)
  {
    var action='delete';
    this.openConfirmDialog(id,"Are you sure you want to Delete withdraw request",action);
  }

  ngAfterViewInit() {
    this.listWithDraw.sort = this.sort;
    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.withDrawService.getDashboardList(
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
      ).subscribe(data => this.listWithDraw.data =data);
  }
}
