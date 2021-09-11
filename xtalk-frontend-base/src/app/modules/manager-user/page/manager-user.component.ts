import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { DashboardService } from '@/modules/dashboard.service';
import { MatTableDataSource, MatPaginator, MatCheckbox, MatButton, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '@/shared/widgets/confirm-modal/confirm-modal.component';
import { EditUserModalComponent } from '@/shared/widgets/edit-user-modal/edit-user-modal.component';
import { ChangePasswordComponent } from '@/shared/widgets/change-password/change-password.component';
import { AddUserComponent} from '@/shared/widgets/add-user/add-user.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort,Sort } from '@angular/material';
import { UserService, AlertService } from '@/_servies';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { User } from '@/_models';
import { ɵangular_packages_platform_browser_platform_browser_k } from '@angular/platform-browser';
@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['./manager-user.component.css']
})
export class ManagerUserComponent implements OnInit ,AfterViewInit{
  listUsers = new MatTableDataSource<User>([]);
  loadedUsers = new MatTableDataSource<User>([]);
  resultsLength:number=30;
  isRateLimitReached:Boolean=false;
  isLoadingResults:Boolean=false;
  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private userService: UserService) {
    this.listUsers = new MatTableDataSource<User>(null);
    this.dashboardService.currentListUser.subscribe(data => {
      if (data != null) 
      {
        this.listUsers = new MatTableDataSource<User>(data.data);
        this.loadedUsers=new MatTableDataSource<User>(data.data);
        this.listUsers.sort = this.sort;
        this.listUsers.paginator=this.paginator
      }
    })
  }
  selection = new SelectionModel<User>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['select','email', 'name', 'role', 'status', 'token', 'actions'];
  @ViewChild(MatPaginator, {static:true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static:true}) sort: MatSort;
  ngOnInit() {
  }

  ngAfterViewInit()
  {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService.getAllUserasAdmin(
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
        this.listUsers.data=data;
        this.loadedUsers.data.concat(data);
      });
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listUsers.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listUsers.data.forEach(row => this.selection.select(row));
  }
  HeaderCheckBoxChanged(model: any) {
    // debugger;
    this.assigned = '';
    if (model.checked == true) {
      this.listUsers.data.forEach(d => {
        // d.IsAssigned = true;
        this.assigned += d.id + ',';
      })
    } else {
      this.listUsers.data.forEach(d => {
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

  editUser(id: string) {
    var userValue = this.listUsers.data.filter(el => {
      return el.id == id;
    });
    this.openEditUserModal(userValue.pop());

  }

  deleteUser(id: string) {
    var action = 'delete';
    this.openConfirmDialog(id, "Are you sure you want to Delete this user", action);

  }

  deActiveUser(id: string) {
    var action = 'de-active';
    this.openConfirmDialog(id, "Are you sure you want to Deactivate this user", action);
  }

  activeUser(id: string) {
    var action = 'active';
    this.openConfirmDialog(id, "Are you sure you want to Activate this user", action);
  }

  changePassword(id: string) {
    this.openChangePassword(id);
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
            this.userService.delete(id).subscribe(data => {
              this.listUsers.data.forEach((item, index, object) => {
                if (item.id == id) {
                  this.listUsers.data.splice(index, 1);
                }
              });
              this.listUsers.data = this.listUsers.data;
              this.alertService.success('Success');
            },
              err => {
                this.alertService.error("Failed");
              });
            break;
          case 'de-active':
            this.userService.deActive(id).subscribe(data => {
              this.listUsers.data.map((item, index) => {
                ;
                if (item.id == id) {
                  item.isActive = false;
                  this.listUsers.data[index] = item;
                }
              });
              this.listUsers.data = this.listUsers.data;
              this.dashboardService.reloadListUser();
              this.alertService.success('Success');
            },
              err => {
                this.alertService.error("Failed");
              });
            break;
          case 'active':
            this.userService.active(id).subscribe(data => {
              this.listUsers.data.map((item, index) => {
                if (item.id == id) {
                  item.isActive = !item.isActive;
                  this.listUsers.data[index] = item;
                }
              });
              this.listUsers.data = this.listUsers.data;
              this.dashboardService.reloadListUser();
              this.alertService.success('Success');
            },
              err => {
                this.alertService.error("Failed");
              });
            break;
          case 'de-active-list':
            var listid=id.split(',');
            this.userService.deActiveList(listid).subscribe(data => {
              this.listUsers.data.map((item, index) => {
                if (item.id == id) {
                  item.isActive = false;
                  this.listUsers.data[index] = item;
                }
              });
              this.listUsers.data = this.listUsers.data;
              //this.dashboardService.reloadListUser();
              this.alertService.success('Success');
              location.reload();
              
            },
              err => {
                this.alertService.error("Failed",true);
              });
            break;
          case 'active-list':
            var listid=id.split(',');
            this.userService.activeList(listid).subscribe(data => {
              this.listUsers.data.map((item, index) => {
                if (item.id == id) {
                  item.isActive = false;
                  this.listUsers.data[index] = item;
                }
              });
              this.listUsers.data = this.listUsers.data;
              //this.dashboardService.reloadListUser();
              this.alertService.success('Success');
              location.reload();
              
            },
              err => {
                this.alertService.error("Failed",true);
              });
            break;
          case 'delete-list':
            var listid=id.split(',');
            this.userService.deleteList(listid).subscribe(data => {
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

  openEditUserModal(user: User) {
    var tmp = false;
    const dialogRef = this.dialog.open(EditUserModalComponent, {
      width: '90%',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
    });
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

  deActiveListUser(assigned:string)
  {
    var action = 'de-active-list';
    this.openConfirmDialog(assigned, "Are you sure you want to Deactivate this users", action);
  }

  activeListUser(assigned:string)
  {
    var action = 'active-list';
    this.openConfirmDialog(assigned, "Are you sure you want to Activate this users", action);
  }

  addNewUser()
  {
    const dialoagRef=this.dialog.open(AddUserComponent,{
      width:"500px",
      data:{role:'member'}
    })
    dialoagRef.afterClosed().subscribe(data=>{
      if(data.status)
      {
        this.listUsers.sort = this.sort;
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
    this.listUsers.data=this.loadedUsers.data;
    this.listUsers.filter=filterValue.trim().toLowerCase();
    
  }
}

