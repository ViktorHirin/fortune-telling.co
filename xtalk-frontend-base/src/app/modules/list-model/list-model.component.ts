import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService ,ModelService , AlertService} from '@/_servies';
import { User} from '@/_models'
@Component({
  selector: 'app-list-model',
  templateUrl: './list-model.component.html',
  styleUrls: ['./list-model.component.css']
})
export class ListModelComponent implements OnInit {
  page=1;
  pageSize =9;
  modelList=[];
  queryString:any;
  constructor(private userService:UserService ,private modelService:ModelService, private alertService:AlertService) {
        this.modelService.models$.subscribe(data=>
          this.modelList=data)
   }
   searchableList=[
     'firstName','lastName'
   ]
  ngOnInit() {
    
  }
  
 
}
