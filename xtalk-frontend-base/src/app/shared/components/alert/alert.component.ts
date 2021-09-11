import { Component, OnInit ,OnDestroy ,Input,Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService} from '@/_servies/alert.service';
import { Alert,AlertType } from '@/_models';
import { Router, NavigationStart } from '@angular/router';
import { MAT_SNACK_BAR_DATA,MatSnackBarRef } from '@angular/material/snack-bar';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  providers:[
   {
    provide: MatSnackBarRef,
    useValue: {}
    }, 
    {
    provide: MAT_SNACK_BAR_DATA,
    useValue: {} // Add any data you wish to test if it is passed/used correctly}
     }
    ],
})
export class AlertComponent implements OnInit,OnDestroy {
    alerts:Alert[]=[];
    @Input() id="default-id";
    @Input() fade:true;
     alertSubscription:Subscription;
     routeSubcription:Subscription;


    constructor(private alertService: AlertService,private router:Router,@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

    ngOnInit() {
        this.alertSubscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                // clear all alert if alert null
                if(!alert.message){
                    this.alerts.filter(x=>x.keepAfterRouteChange == true);
                    // set keepAfterRouteChange to false
                    this.alerts.map(x=>x.keepAfterRouteChange=false);
                    return ;
                }
                // push alert to list alerts
                this.alerts.push(alert);
                if(alert.autoClose){
                    setTimeout(()=>{
                        this.removeAlert(alert);
                    },3000)
                }
                
            });

         // clear alerts on location change
        this.routeSubcription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            this.alertService.clear(this.id);
        }
        });
    }

    removeAlert(alert:Alert){
        // check if already removed to prevent error on auto close
        if (!this.alerts.includes(alert)) return;

        if (this.fade) {
            // fade out alert
            this.alerts.find(x => x === alert).fade = true;

            // remove alert after faded out
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert);
            }, 250);
        } else {
            // remove alert
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }

    cssClass() {
       // if (!alert) return;

        const classes = [];
                
        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Info]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        }

        classes.push(alertTypeClass[this.data.snackType]);

        // if (alert.fade) {
        //     classes.push('fade');
        // }

        return classes.join(' ');
    }

    get getIcon() {
        const alertTypeClass = {
            [AlertType.Success]: 'done',
            [AlertType.Error]: 'error',
            [AlertType.Info]: 'warning',
            [AlertType.Warning]: 'info'
        }
        return alertTypeClass[this.data.snackType];

      }

    ngOnDestroy() {
        this.alertSubscription.unsubscribe();
        this.routeSubcription.unsubscribe();
    }

}
