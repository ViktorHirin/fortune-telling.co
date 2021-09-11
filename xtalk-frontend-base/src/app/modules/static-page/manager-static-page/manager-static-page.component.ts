import { Component, OnInit ,ViewChild,AfterViewInit} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatCheckbox, MatButton, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { ConfirmModalComponent } from '@/shared/widgets/confirm-modal/confirm-modal.component';
import { UserService, AlertService ,PageconfigService} from '@/_servies';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {DashboardService} from '@/modules/dashboard.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-manager-static-page',
  templateUrl: './manager-static-page.component.html',
  styleUrls: ['./manager-static-page.component.css']
})
export class ManagerStaticPageComponent implements OnInit {

  listPage = new MatTableDataSource<any>([]);
  resultsLength:number=0;
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  constructor(
    public dialog:MatDialog,
    private router:Router,
    private alertService: AlertService,
    private userService: UserService,
    private pageConfig:PageconfigService) {
    this.pageConfig.getListStaticPage().subscribe(data=>{
    this.listPage=new MatTableDataSource<any>(data.data);
    },
    error=>{
      this.alertService.error('Error');
    })
  }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['title', 'content', 'date','actions'];
  ngOnInit()
  {
    
  }

  ngAfterViewInit()
  {
   
  }

  details(slug:string=null)
  {
    location.pathname='/dashboard/static-page/edit/'+slug;
  }

  delete(id:string=null,i:number)
  {
    var tmp = false;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: { title:'Are yout want to delete this page', yes: true, no: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pageConfig.deleteStaticPage(id).subscribe(data=>{
          this.alertService.success('Saved Successful');
          let dataTable=this.listPage.data;
          dataTable.splice(i,1);
          this.listPage.data=dataTable;
        },
        err=>{
          this.alertService.error("Failed");
        })
      }
    });
    
  }

  add()
  {
    this.router.navigate(['/dashboard/static-page/new']);
  }

  getContent(content:string)
  {
    return content.slice(0,100);
  }



}
