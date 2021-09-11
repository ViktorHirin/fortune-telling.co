import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { MatTableDataSource, MatPaginator, MatCheckbox, MatButton, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '@/shared/widgets/confirm-modal/confirm-modal.component';
import { EditUserModalComponent } from '@/shared/widgets/edit-user-modal/edit-user-modal.component';
import { AddUserComponent } from '@/shared/widgets/add-user/add-user.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort,Sort } from '@angular/material';
import { UserService,ModelService ,AlertService } from '@/_servies';
import { User,Model } from '@/_models';
import { ChangePasswordComponent } from '@/shared/widgets/change-password/change-password.component';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-manager-model',
  templateUrl: './manager-model.component.html',
  styleUrls: ['./manager-model.component.css']
})
export class ManagerModelComponent implements OnInit {

  listModels = new MatTableDataSource<Model>([]);
  loadedModels=new MatTableDataSource<Model>([]);
  resultsLength:number=30;
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private modelService: ModelService) {
      
        this.dashboardService.currentListModel.subscribe(data => 
    {
      if (data != null && data.data) 
      {
        this.listModels = new MatTableDataSource<Model>(data.data);
        this.loadedModels = new MatTableDataSource<Model>(data.data);
        this.listModels.sort = this.sort;
        this.paginator=this.paginator;
      }
      else
      {
        this.listModels=new MatTableDataSource([]);
        
      }
    })

  }
  selection = new SelectionModel<Model>(true, []);
  assigned: string = '';
  displayedColumns: string[] = [ 'select','email', 'name', 'role', 'status', 'token', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    
    //this.listModels = new MatTableDataSource<Model>(null);
  }

  ngAfterViewInit()
  {
    this.listModels.sort = this.sort;
    this.paginator=this.paginator;
    // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.modelService.getAllModelasAdmin(
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
      ).subscribe(data => {
        this.listModels.data=data;
        this.loadedModels.data.concat(data);
      });
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listModels.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listModels.data.forEach(row => this.selection.select(row));
  }
  HeaderCheckBoxChanged(model: any) {
    // debugger;
    this.assigned = '';
    if (model.checked == true) {
      this.listModels.data.forEach(d => {
        // d.IsAssigned = true;
        this.assigned += d.id + ',';
      })
    } else {
      this.listModels.data.forEach(d => {
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

  editUser(user) {
    this.openEditUserModal(user);

  }

  deleteUser(id: string) {
    var action = 'delete';
    this.openConfirmDialog(id, "Are you sure you want to Delete this model", action);

  }

  deActiveUser(id: string) {
    var action = 'de-active';
    this.openConfirmDialog(id, "Are you sure you want to Deactivate this model", action);
  }

  activeUser(id: string) {
    var action = 'active';
    this.openConfirmDialog(id, "Are you sure you want to Activate this model", action);
  }

  openConfirmDialog(id: string, title: string, action: string): void {
    var tmp = false;
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '250px',
      data: { title: title, yes: true, no: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (action) {
          case 'delete':
            this.modelService.delete(id).subscribe(data => {

              this.listModels.data.forEach((item, index, object) => {
                if (item.id == id) {
                  item.isActive = false;
                  this.listModels.data[index] = item;
                  this.listModels.data.splice(index,1); 
                }
              });
              this.listModels.data = this.listModels.data;
              this.alertService.success('Sucess');
            }, err => {
              this.alertService.error('Failed');
            });
            break;
          case 'de-active':
            this.modelService.deActive(id).subscribe(data => {
              this.listModels.data.map((item, index) => {
                ;
                if (item.id == id) {
                  item.isActive = false;
                  this.listModels.data[index] = item;
                }
              });
              this.listModels.data = this.listModels.data;
              this.dashboardService.reloadListUser();
              this.alertService.success('Success');
            }, err => {
              this.alertService.error('Failed');
            });
            break;
          case 'active':
            this.modelService.active(id).subscribe(data => {
              this.listModels.data.map((item, index) => {
                if (item.id == id) {
                  item.isActive = !item.isActive;
                  this.listModels.data[index] = item;
                }
              });
              this.listModels.data = this.listModels.data;
              this.dashboardService.reloadListUser();
              this.alertService.success('Success');
            }, err => {
              this.alertService.error('Failed');
            });
            break;
          case 'de-active-list':
            var listid = id.split(',');
            this.modelService.deActiveList(listid).subscribe(data => {
              this.listModels.data.map((item, index) => {
                if (item.id == id) {
                  item.isActive = false;
                  this.listModels.data[index] = item;
                }
              });
              this.listModels.data = this.listModels.data;
              //this.dashboardService.reloadListUser();
              this.alertService.success('Success', true);
              location.reload();

            },
              err => {
                this.alertService.error("Failed", true);
              });
            break;
          case 'active-list':
            var listid = id.split(',');
            this.modelService.activeList(listid).subscribe(data => {
              this.listModels.data.map((item, index) => {
                if (item.id == id) {
                  item.isActive = false;
                  this.listModels.data[index] = item;
                }
              });
              this.listModels.data = this.listModels.data;
              //this.dashboardService.reloadListUser();
              this.alertService.success('Success', true);
              location.reload();

            },
              err => {
                this.alertService.error("Failed", true);
              });
            break;
            case 'delete-list':
              var listid=id.split(',');
              this.modelService.deleteList(listid).subscribe(data => {
                //this.dashboardService.reloadListUser();
                this.alertService.success('Success');
                location.reload();
                
              },
                err => {
                  this.alertService.error("Failed",true);
                });
              break;
          default:
            return;
        }

      }
    });
  }

  openEditUserModal(user: Model) {
    var tmp = false;
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '90%',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  changePassword(id: string) {
    this.openChangePassword(id);
  }
  openChangePassword(id) {
    const dialoagRef = this.dialog.open(ChangePasswordComponent, {
      width: "500px",
      data: id
    });
    dialoagRef.afterClosed().subscribe(data=>{
      if(data.status == 'success')
      {
        this.alertService.success('Success');
      }
      else
      {
        this.alertService.error('Failed');
      }
    })

  }

  deActiveListUser(assigned: string) {
    var action = 'de-active-list';
    this.openConfirmDialog(assigned, "Are you sure you want to Deactivate this models", action);
  }

  activeListUser(assigned: string) {
    var action = 'active-list';
    this.openConfirmDialog(assigned, "Are you sure you want to Activate this models", action);
  }

  addNewUser() {
    const dialoagRef = this.dialog.open(AddUserComponent, {
      width: "500px",
      data: { role: 'clairvoyant' }
    })
    dialoagRef.afterClosed().subscribe(data=>{
      if(data.status)
      {
        this.listModels.sort = this.sort;
        const sortState: Sort = {active: 'name', direction: 'desc'};
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    })
  }
  deleteListUser(assigned:string)
  {
    var action = 'delete-list';
    this.openConfirmDialog(assigned, "Are you sure you want to Delete this users", action);
  }

  applyFilter(filterValue: string) {
    const sortState: Sort = {active: 'email', direction: 'desc'};
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
    this.paginator.pageSize=500;
    this.listModels.data=this.loadedModels.data;
    this.listModels.filter = filterValue.trim().toLowerCase();
  }
}

