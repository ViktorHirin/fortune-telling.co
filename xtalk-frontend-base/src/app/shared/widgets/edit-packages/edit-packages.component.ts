import {Component, Inject ,OnInit ,ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { environment} from 'environments/environment';
import { HttpClient} from '@angular/common/http';
export interface DialogPackage {
  title: string;
  id:string;
}
@Component({
  selector: 'app-edit-packages',
  templateUrl: './edit-packages.component.html',
  styleUrls: ['./edit-packages.component.css']
})
export class EditPackagesComponent implements OnInit {

  constructor(private httpClient:HttpClient, public dialogRef: MatDialogRef<EditPackagesComponent>,
    @Inject(MAT_DIALOG_DATA) public packageItem: any) {
    if(this.packageItem == null)
    {
      this.packageItem ={
        name:'',
        description:'',
        price:'',
        token:'',
        flexformId:''
      };
    }
   }

  ngOnInit() {
  }
  onSubmit(){
    this.httpClient.put<any>(`${environment.apiUrl}/api/v1/payment-setting/top-up`,{package:this.packageItem})
                    .subscribe(data => {
                      this.dialogRef.close({status:true});

                    },
                    error=>{
                      this.dialogRef.close({status:false});
                    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
