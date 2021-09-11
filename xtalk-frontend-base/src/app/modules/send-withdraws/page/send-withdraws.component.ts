import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatCheckbox, MatButton, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort,Sort } from '@angular/material';
import { UserService, WithDrawService, AlertService, PageconfigService } from '@/_servies';
import { WithDraw } from '@/_models/';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-send-withdraws',
  templateUrl: './send-withdraws.component.html',
  styleUrls: ['./send-withdraws.component.css']
})
export class SendWithdrawsComponent implements OnInit, AfterViewInit {
  selection = new SelectionModel<WithDraw>(true, []);
  assigned: string = '';
  withdrawFormGroup: FormGroup;
  submitted: boolean = false;
  withdrawsHistory = new MatTableDataSource<WithDraw>(null);
  blance: number = 0;
  commisstion: number = 10;
  rate: number = 1;
  price: any;
  currency: string = '$';
  resultsLength: number = 30;
  isRateLimitReached: Boolean = false;
  isLoadingResults: Boolean = false;
  pedingAmount: number = 0;
  withdrawTotal: number = 0;
  constructor(private withdrawService: WithDrawService, public dialog: MatDialog, private userService: UserService, private formBuilder: FormBuilder,
    private alertService: AlertService, private pageConfigService: PageconfigService) {
    //this.withdrawsHistory = new MatTableDataSource<WithDraw>([]);
    this.withdrawFormGroup = this.formBuilder.group({
      amoutCtrl: ['', [Validators.required]]
    }, null);
    this.pageConfigService.currentConfig.subscribe(data => {
      if (data) {
        this.price = data.price || 10;
        this.currency = data.currency;
      }
    })
    this.withdrawService.currentListWithDraw.subscribe(data => {
      if (data != null && data.length) {
        
        this.withdrawsHistory = new MatTableDataSource<WithDraw>(data);
        this.withdrawsHistory.data.forEach((withDrawItem) => {
          if (withDrawItem.status == 'pending') {
            this.pedingAmount = this.pedingAmount + withDrawItem.amount;
          }
          this.withdrawTotal += withDrawItem.amount;
        })
      }
      else {
        this.withdrawsHistory = new MatTableDataSource<WithDraw>([]);
      }
    })

  }
  displayedColumns: string[] = ['date', 'status', 'amount'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
   this.reGetblance();

  }
  
  reGetblance(){
    this.withdrawService.getBlance().subscribe(data => {
      this.blance = data['data']['blance'];
      this.rate = data['data'].rate || 1;
      this.commisstion = data['data']['commission'];
    }, err => {
      this.alertService.error(err['data'].msg);
    })
  }
  reCaculatorDashBoard(){
    let pedingAmount = 0;
    let withdrawTotal = 0;
    this.withdrawsHistory.data.forEach((withDrawItem) => {
      if (withDrawItem.status == 'pending') {
        pedingAmount = pedingAmount + withDrawItem.amount;
      }
      withdrawTotal += withDrawItem.amount;
    })
    this.pedingAmount = pedingAmount;
    this.withdrawTotal = withdrawTotal;
    
  }
  loadDataTable(){
      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.sort.active == 'date') {
            return this.withdrawService.getList(
              'createdAt', this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
          }
          

          return this.withdrawService.getList(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data['data']['total_count'];
          return data['data']['withdraws'];
        }),
        catchError(() => {
          this.isLoadingResults = false;

          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.withdrawsHistory.data = data;
       
      });
  }
  ngAfterViewInit() {
    this.withdrawsHistory.sort = this.sort;
    this.withdrawsHistory.paginator = this.paginator;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadDataTable();
  }
  public get f() {
    return this.withdrawFormGroup.controls;
  }
  public addNewWithDraw() {
    this.submitted = true;
    if (this.withdrawFormGroup.invalid) {
      return
    }
    if (!this.canAddWithdraw()) {
      this.alertService.error('You can send withdraw request only if the amount is greater than or equal to the available balance');
      return;
    }
    if (this.f.amoutCtrl.value <= 1) {
      this.alertService.error('You can send withdraw request only if the amount is greater than 1$');
      return;
    }
    this.withdrawService.addWithDraw(this.f.amoutCtrl.value).subscribe(data => {
      const sortState: Sort = {active: '_id', direction: 'desc'};
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
       this.reCaculatorDashBoard();
 
      this.alertService.success('Send Withdraw Successful');

    }, err => {
      this.alertService.error(err['data'].msg);
    });
  }

  public getBlance() {
    return this.initToFloat(this.blance / this.rate);
  }
  public initToFloat(number: number, fix: number = 2) {
    let input = number.toString();
    input = parseFloat(input).toFixed(fix);

    return input;
  }

  public getAdminCommission(commission: number) {

    return this.initToFloat((((this.blance * 100) / (100 - this.commisstion) * this.commisstion) / 100) / this.rate);
  }

  public getPendingAmout() {

    if (this.pedingAmount) {
      return this.initToFloat(this.pedingAmount);
    }
    return 0;
  }
  public getWithdrawTotal() {

    if (this.withdrawTotal) {
      return this.initToFloat(this.withdrawTotal);
    }
    return '0';
  }


  public canAddWithdraw() {
    let withdrawAmout = this.f.amoutCtrl.value;
    return (this.blance / this.rate) - this.pedingAmount - withdrawAmout > 0 ? true : false;
  }

  public getAvailbleBlance() {
    let avaiBlance = (this.blance / this.rate )  - this.pedingAmount;
    return this.initToFloat(avaiBlance)
  }
}
