import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import { AlertService}  from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { EditOptionsComponent } from '@/shared/widgets/edit-options/edit-options.component';
import { environment} from 'environments/environment';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource, MatPaginator,MatDialog} from '@angular/material';
@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit {
  isNew:Boolean=false;
  listCommission=new MatTableDataSource<any>([]); 
  constructor(private formBuilder:FormBuilder,private httpClient:HttpClient,
    private alertService:AlertService, private authentication:AuthenticationService,
    public dialog: MatDialog,) {  
 }
 displayedColumns: string[] = ['option_name' , 'option_value' , 'action'];
 @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 @ViewChild(MatSort, {static: true}) sort: MatSort;

ngOnInit() {
 
  this.httpClient.get<any>(`${environment.apiUrl}/api/backend/option/all`)
                  .subscribe(
                    data=>{
                      if(data.data){
                        this.listCommission=new MatTableDataSource<any>(data.data); ;
                      }
                      
                    },
                    err=>{
                      this.alertService.error(err);
                    }
                  );
                }
addNew(){
  this.isNew=true;
}
editOptions(options){
  const dialogRef = this.dialog.open(EditOptionsComponent, {
    width: '250px',
    data:options
  });
}

}
