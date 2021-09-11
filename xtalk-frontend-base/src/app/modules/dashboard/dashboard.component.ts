import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import {User} from '@/_models';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading:Boolean=false;
  bigChart = [];
  cards = [];
  withdraw=[];
  pieChart = [];
  reports:any={};
  displayedColumns: string[] = ['firstName', 'lastName', 'role', 'status'];
  dataSource=new MatTableDataSource<User>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dashboardService: DashboardService) { 
    this.reports=this.dashboardService.getReports().subscribe(data=>{
      if(data['status'] == true)
      {
        this.reports=data['data'];
        this.withdraw=[this.reports.withdraw.pending,this.reports.withdraw.reject,this.reports.withdraw.approved];
        this.pieChart= [{
          name: 'Pending',
          y: this.reports.withdraw.pending/this.reports.withdraw.total,
          sliced: true,
          selected: true
        }, {
          name: 'Approved',
          y: this.reports.withdraw.approved/this.reports.withdraw.total,
        }, {
          name: 'Reject',
          y: this.reports.withdraw.reject/this.reports.withdraw.total,
        }, ];
      }
      
    },
    error=>{
      console.log(error);
    });

    this.dashboardService.getCharts().subscribe(data=>{
      // console.log(data.data['user'][12]);
      // this.bigChart=this.dashboardService.bigChart();
      //  for (let index = 0; index < 12; index++) {
      //    const userItem = data.data['user'][index];
      //    if(userItem)
      //    {
      //      this.bigChart[0].data[userItem._id]=userItem.total;
      //    }
         
      //    const modelItem = data.data['model'][index];
      //    if(modelItem)
      //    {
      //      this.bigChart[1].data[modelItem._id]=modelItem.total;
      //    }
         
      //    const reviewItem = data.data['review'][index];
      //    if(reviewItem)
      //    {
      //      this.bigChart[2].data[reviewItem._id]=reviewItem.total;
      //    }
         
      //    const withdrawItem = data.data['withdraw'][index];
      //    if(withdrawItem)
      //    {
      //      this.bigChart[2].data[withdrawItem._id]=withdrawItem?withdrawItem.total:0;
      //    }    
         
      //    if(index==11){
      //     this.loading=true;
      //    }
      //  }
       
     })
  }

  ngOnInit() {

    // this.bigChart = this.dashboardService.bigChart();
    
    this.cards = this.dashboardService.cards();
     this.dashboardService.currentListUser.subscribe(data=>{
      if(data && data.data)
      {
        this.dataSource =new MatTableDataSource(data.data);
      }
    },
    err=>{
      this.dataSource=null;
    });
    this.dataSource.paginator = this.paginator;
  }

  getWithdraw(){   
      return this.reports?[this.reports.totalModel,this.reports.withdraw.pending,this.reports.withdraw.reject,this.reports.withdraw.approved]:[];   
  }

  getPieChart() {
   return  this.pieChart;
  }

  ngAfterViewInit()
  {
  }

  getBigChart()
  {
    return this.bigChart;
  }
  getBigChart2()
  {
    return this.dashboardService.bigChart()
  }
  
}
