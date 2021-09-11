import { Component, OnInit } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { ModelService  } from '@/_servies/model.service';
import {SearchService} from '@/_servies/search.service';
import {ChatService} from '@/_servies/chat.service';
import { UserService} from '@/_servies/user.service';
import {AlertService} from '@/_servies/alert.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import {  Subject} from 'rxjs';
import { EventSocket} from '@/_models'
@Component({
  selector: 'list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.css']
})
export class ListModelComponent implements OnInit {
  page=1;
  pageSize =9;
  modelList=[];
  queryString:any;
  filter:string;
  filter$:any;
  totalModel:number;
  unsubcribe$ = new Subject<void>();
  searchTerm$ = new Subject<string>();
  constructor(private authentication:AuthenticationService,private searchService:SearchService, private userService:UserService ,private modelService:ModelService, private alertService:AlertService,private chatService:ChatService) {
    
   }
   searchableList=[
     'firstName','lastName'
   ]
  ngOnInit() {
    this.modelService.getAllModel('status','desc',0,9).subscribe(data=>{
      this.modelList=data.data;
      this.totalModel=data.total_count;
    });
   this.listernOnline();
   this.listernOffline();
   this.listernCalling();
   this.listernCallingOff()
  }
  
  listernOnline() {
    console.log('asdsadasaddadas');
    this.modelService.socketService.onEvent(this.modelService.EventModelOnline).subscribe(data => {
      this.modelService.setModelOnOff(this.modelList, data, true);
    });
  }
  listernOffline() {
    this.modelService.socketService.onEvent(this.modelService.EventModelOffline).subscribe(data => {
      this.modelService.setModelOnOff(this.modelList, data, false);
    });
  }
  
  listernCalling() {
    this.modelService.socketService.onEvent(EventSocket.CALLSTART).subscribe(data => {
      this.modelService.setModelCallOnOff(this.modelList, data, true);
    });
  }

  listernCallingOff() {
    this.modelService.socketService.onEvent(EventSocket.CALLEND).subscribe(data => {
      this.modelService.setModelCallOnOff(this.modelList, data, false);
    });
  }

  changeFilter($event)
  {

    this.unsubcribe$.next();
    this.filter=$event.target.value;
    this.filter$=this.searchService.searchWith(this.searchTerm$,this.filter).pipe(takeUntil(this.unsubcribe$));
    this.filter$.subscribe(results => {
      this.modelList = results.data;
    });
    
  }

  pageChange(e){
    this.modelService.getAllModel('status','desc',e-1,9).subscribe(data=>{
      this.modelList=data.data;
      
    });
    var listModel=document.getElementById('list-model');
    listModel.scrollIntoView();
  }

  search($event)
  {
    if(!this.filter)
    {
      this.alertService.warning('Please choose a filter menu');
    }
    else
    {
      this.searchTerm$.next($event.target.value)
    }
  }

  notMe(model:any){
    if(model && this.authentication.currentUserValue && this.authentication.currentUserValue.id == model.id){
      return false;
    }
    return true;
  }
}
