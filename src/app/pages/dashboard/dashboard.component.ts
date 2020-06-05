import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-dashboard',
  template: `
    <h1>Dashboard</h1>
    {{ isLoading }}
    <button type="button" (click)="isLoading=!isLoading">Toggle Loading</button>
    <div echarts [options]="options"
         (chartInit)="isLoading = true"
         [loading]="isLoading"
         id="sales-chart"></div>
    <div id="sales-by-category-chart">
      <h2>Categories</h2>
    </div>
    <div id="fulfillment-snapshot">
      <h2>Fulfillment</h2>
    </div>
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: auto auto;
      grid-template-rows: auto auto auto auto;
    }
    h1 { grid-row: 1; grid-column: 1/3; }
    #sales-chart {
      grid-column: 1/3;
      grid-row: 2;
    }

    #sales-by-category-chart {
      grid-row: 3;
    }
    #fulfillment-snapshot {
      grid-row: 3;
      grid-column: 2;
    }
  `]
})
export class DashboardComponent implements OnInit {

  options: any;
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];


    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    for (let i = 0; i < 30; i++) {

      xAxisData.push(lastMonth.toLocaleDateString('id-ID'));
      data1.push(0);
      data2.push(0);
      // data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      // data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
      lastMonth.setDate(lastMonth.getDate() + 1);
    }

    this.options = {
      legend: {
        data: ['orders', 'revenue'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'orders',
          type: 'bar',
          data: data1,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'revenue',
          type: 'bar',
          data: data2,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };




    // this.isLoading = true;

  }

}
