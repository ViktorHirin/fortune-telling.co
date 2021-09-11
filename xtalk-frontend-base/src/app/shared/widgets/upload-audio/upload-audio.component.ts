import {Component, Inject ,OnInit ,ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Validators,FormBuilder, FormGroup} from '@angular/forms';
import {ModelService } from '@/_servies/model.service';
import {AlertService} from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import { environment} from 'environments/environment';

@Component({
  selector: 'app-upload-audio',
  templateUrl: './upload-audio.component.html',
  styleUrls: ['./upload-audio.component.css']
})
export class UploadAudioComponent implements OnInit {

  fileData: File = null;
  previewUrl:any;
  audioFormGroup:FormGroup;
  constructor(private authentication:AuthenticationService ,private el:ElementRef,
    private modelService:ModelService,private _formBuilder:FormBuilder,
    private alertService:AlertService,
   public dialogRef: MatDialogRef<UploadAudioComponent>){

   }
  ngOnInit() {
    this.audioFormGroup = this._formBuilder.group({
      audioCtrl: ['', Validators.required]
    });
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }

  onSubmit(){
    if(this.audioFormGroup.invalid && this.checkFileSize){
      return ;
    }


    this.modelService.updateAudio(this.fileData)
                    .subscribe(data => {
                      this.alertService.success('Update Successful',false,true);
                      this.authentication.reload();
                      this.dialogRef.close({
                        user:data.data,
                        status:true
                      });
                    },
                    error=>{
                      this.dialogRef.close({
                        status:false,
                        user:null
                      });
                      this.alertService.error(error);
                      
                    });
                     
  
  }
  onCloseClick()
  {
    this.dialogRef.close();
  }

  checkFileSize():boolean{
    if(this.fileData == null){
      return false;
    }
    return this.fileData.size>environment.maxAudioFileSize?false:true;
  }

}
