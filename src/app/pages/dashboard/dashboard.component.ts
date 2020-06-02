import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nus-dashboard',
  template: `
    <h1>Dashboard</h1>
    <div echarts [options]="options" class="demo-chart"></div>
  `,
  styles: [`


  `]
})
export class DashboardComponent implements OnInit {

  options: any;

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
  }

}
