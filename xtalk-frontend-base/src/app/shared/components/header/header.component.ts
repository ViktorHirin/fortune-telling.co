import { Component, OnInit,Inject } from '@angular/core';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {AuthenticationService} from '@/_servies/authentication.service';
//import {WindowRef} from '@/_servies/windowref.service';
import { User,Config} from '@/_models/';
import { MatDialog } from '@angular/material';
import {  ChangePasswordComponent} from '@/shared/widgets/change-password/change-password.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user:User;
  pageConfig:Config;
  constructor(
    private dialog:MatDialog,
    private pageconfigService:PageconfigService,
  //  private windowRef:WindowRef,
    private authentication:AuthenticationService) {

    this.authentication.currentAmin.subscribe((data)=>{
      if(data){
        this.user = data;
      }
    });
    console.log('this.user',this.user);
    this.pageconfigService.currentConfig.subscribe(data=>{
      if(data !=null)
      {
        this.pageConfig=data;
      }
      else
      {
        this.pageConfig = new Config();
      }
    })
   }

  ngOnInit() { }

  

  logout(){
    this.authentication.logoutAdmin();
  }

  changePassword(){
    const dialoagRef=this.dialog.open(ChangePasswordComponent,{
      width:"500px",
      data:this.user.id
    })
  }

  help()
  {
    //this.windowRef.nativeWindow.open("https://adent.io/products/xtalk/",'_blank');
    window.open("https://adent.io/products/xtalk/",'_blank');
  }

}
