import {WindowRef} from '@/_servies/windowref.service';
import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';


@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  chartOptions: {};
  @Input() data: any = [];
  @Input() title: string='';
  @Input() subTitle: string = '';

  Highcharts = Highcharts;

  constructor(private windowRef:WindowRef) { }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'area'
      },
      title: {
        text: this.title
      },
      subtitle: {
        text: this.subTitle
      },
      tooltip: {
        split: true,
       // valueSuffix: ' '
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
      },
      yAxis: {
        title: {
            text: 'Count'
        }
      },

      xAxis: {
          accessibility: {
              rangeDescription: 'Range: 1 to 12'
          }
      },
      plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 1
        }
    },
      series: this.data
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
    //   this.windowRef.nativeWindow.dispatchEvent(
    //     new Event('resize')
    //   );
    // }, 300);
    window.dispatchEvent(
          new Event('resize')
        );
      }, 300);
  }

}
