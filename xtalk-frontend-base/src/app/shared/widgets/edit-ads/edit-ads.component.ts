import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AlertService} from '@/_servies/alert.service';
import {environment} from 'environments/environment';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-edit-ads',
  templateUrl: './edit-ads.component.html',
  styleUrls: ['./edit-ads.component.css']
})
export class EditAdsComponent implements OnInit {

  constructor(private httpClient:HttpClient, public dialogRef: MatDialogRef<EditAdsComponent>,private alertService:AlertService,
    @Inject(MAT_DIALOG_DATA) public ads: any) {
    if(this.ads == null)
    {
      this.ads ={
        title:'',
        description:'',
        file:'',
        type:'image',
        postions:'footer'
      };
    }
   }
  message:string='Supports only image formats , No video formats supported';
  previewUrl:any;
  fileData:File;
  ngOnInit()
  {
  }
  onSubmit()
  {
   // var file=this.ads.baseUrl;
    var formData=new FormData();
    delete this.ads.baseUrl;
    formData.append('ads',this.fileData);
    formData.append('data',JSON.stringify(this.ads));
    this.httpClient.put<any>(`${environment.apiUrl}/api/backend/ads/`,formData)
                    .subscribe(data => {
                      this.alertService.success('Sucess');
                      this.dialogRef.close({status:true});

                    },
                    error=>{
                      this.alertService.success('Failed');
                    });
  }

  onCloseClick(): void
  {
    this.dialogRef.close();
  }

  fileProgress(fileInput: any) 
  {
    this.fileData = <File>fileInput.target.files[0];
    if(this.fileData.type == '')
    {
      this.message="Don't support this extension";
    }
    else
    {
      if(this.isImage(this.fileData.name))
      {
        this.message=null;
        this.preview();
      }
      else
      {
        this.message="Don't support this extension";
      }
    }
  }

  preview() 
  {
      // Show preview 
      var mimeType = this.fileData.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
  
      var reader = new FileReader();      
      reader.readAsDataURL(this.fileData); 
      reader.onload = (_event) => { 
        this.previewUrl = reader.result; 
        this.ads.baseUrl=this.previewUrl;
      }
  }

   getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  
   isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        //etc
        return true;
    }
    return false;
  }
}
