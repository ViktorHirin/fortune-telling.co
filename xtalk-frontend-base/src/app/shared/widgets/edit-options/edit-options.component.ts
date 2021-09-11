import { Component,  Inject ,OnInit ,ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient} from '@angular/common/http';
import { environment} from 'environments/environment';
import { AlertService } from '@/_servies';
@Component({
  selector: 'app-edit-options',
  templateUrl: './edit-options.component.html',
  styleUrls: ['./edit-options.component.css']
})
export class EditOptionsComponent implements OnInit {

  constructor(private httpClient:HttpClient, public dialogRef: MatDialogRef<EditOptionsComponent>,private alertService:AlertService,
    @Inject(MAT_DIALOG_DATA) public options: any) {
    if(this.options == null)
    {
      this.options ={
        option_name:'',
        option_value:''
      };
    }
   }

  ngOnInit() {
  }
  onSubmit(){
    this.httpClient.put<any>(`${environment.apiUrl}/api/backend/option`,{value:this.options.option_value,name:this.options.option_name})
                    .subscribe(data => {
                      this.alertService.success('Saved Successfully');
                      this.dialogRef.close({status:true});
                    },
                    error=>{
                      this.alertService.success(error);
                      
                    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
