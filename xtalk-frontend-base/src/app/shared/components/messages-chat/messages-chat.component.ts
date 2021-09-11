import { Component, OnInit, ViewChild, ElementRef,Input  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadService } from  '@/_servies/upload.service';
import { Chat} from '@/_models/chat.model';
import { User } from '@/_models';
import { ChatService } from '@/_servies/chat.service';
import {ImageHelper} from '@/_helpers/image';
@Component({
  selector: 'app-messages-chat',
  templateUrl: './messages-chat.component.html',
  styleUrls: ['./messages-chat.component.css']
})
export class MessagesChatComponent implements OnInit {
  imageHelper:ImageHelper=new ImageHelper();
  @Input('message') message:Chat;
  @Input('to') to:User;
  @Input('user') user:User;
  uploaded:boolean=false;
  constructor(private chatService:ChatService,private uploadService:UploadService) { }

  ngOnInit() {
    if(!this.message.isNew)
    {

    }
    if(this.message.type == 'image' && this.message.isNew)
    {
      let imgage= new Image();
      this.uploadFile();
    }
    if(this.message.type == 'text' && this.message.isNew)
    {
      this.chatService.sendMessage(this.message);
    }
  }
  preview(file:File) 
  {
      // Show preview 
      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
  
      var reader = new FileReader();      
      reader.readAsDataURL(file); 
      reader.onload = (_event) => {
        this.message.imageLink=reader.result;
      }
  }

  uploadFile() {  
    this.uploaded=true;
    const formData = new FormData();  
    formData.append('file', this.message.file.data);  
    this.message.file.inProgress = true;  
    this.uploadService.upload(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            this.message.file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        this.message.file.inProgress = false;  
        return of(`${this.message.file.data.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          if(event.body.status == true)
          {
            this.message.imageLink=event.body.data.url;
            this.chatService.sendMessage(this.message);
          }  
        }  
      });  
  }

}
