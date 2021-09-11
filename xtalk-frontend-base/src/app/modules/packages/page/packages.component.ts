import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../../dashboard.service';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '@/shared/widgets/confirm-modal/confirm-modal.component';
import { EditPackagesComponent } from '@/shared/widgets/edit-packages/edit-packages.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { UserService, AlertService } from '@/_servies';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  listPackages = new MatTableDataSource<any>([]);
  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog, private alertService: AlertService,
    private userService: UserService, private httpClient: HttpClient) {

  }
  selection = new SelectionModel<any>(true, []);
  assigned: string = '';
  displayedColumns: string[] = ['name', 'price', 'token', 'flexformId', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.loadData();
    this.listPackages.paginator = this.paginator;
    this.listPackages.sort = this.sort;
  }

  loadData() {
    this.httpClient.get<any>(`${environment.apiUrl}/api/v1/payment-setting/list/top-up`)
      .subscribe(
        data => {
          this.listPackages = this.listPackages = new MatTableDataSource<any>(data.data);
          this.listPackages.sort = this.sort;
        },

      );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listPackages.data.length;
    return numSelected == numRows;
  }

  ngAfterViewInit() {
    this.listPackages.sort = this.sort;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.listPackages.data.forEach(row => this.selection.select(row));
  }
  HeaderCheckBoxChanged(packageItem: any) {
    // debugger;
    this.assigned = '';
    if (packageItem.checked == true) {
      this.listPackages.data.forEach(d => {
        // d.IsAssigned = true;
        this.assigned += d.id + ',';
      })
    } else {
      this.listPackages.data.forEach(d => {
        // d.IsAssigned = false;
      })
    }
  }

  CheckBoxChanged(packageItem: any, ID: any) {
    // debugger;
    if (packageItem.checked == true) {
      this.assigned = this.assigned + ID + ',';
    } else {
      this.assigned = this.assigned.replace(ID + ',', "");
    }
  }

  editPackage(id: string) {
    this.openEditPackageModal(id);
  }

  addPackage() {
    this.openEditPackageModal();
  }
  deletePackage(id: string) {
    var action = 'delete';
    this.openConfirmDialog(id, "'Are you sure delete this package", action);

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
            this.httpClient.delete<any>(`${environment.apiUrl}/api/v1/payment-setting/top-up/${id}`).subscribe(data => {
              this.ngOnInit();
            });
            break;
          default:
            return;
        }

      }
    });
  }

  openEditPackageModal(packageItem: any = null) {
    const dialogRef = this.dialog.open(EditPackagesComponent, {
      width: '40%',
      data: packageItem
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.alertService.success('Saved Successfully');
        this.loadData();
      }
      if (result && !result.status) {
        this.alertService.error('Failed');
      }
    });
  }

}
