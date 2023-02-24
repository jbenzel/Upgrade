import { Component, OnInit } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider'; 
import * as Chartist from 'chartist';
import { Chart, ChartData, ChartEvent, ChartType } from 'chart.js';
// import { PieChart } from 'chartist';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  constructor() { }
  ngOnInit(): void {
    this.createCGPAchart();
    this.createEGPAchart();
    this.createProgressChart();
  }

  public CGPAchart: any;
  public EGPAchart: any;
  public progressChart: any;
  createCGPAchart(){
    this.CGPAchart = new Chart("CGPAchart", {
      type: 'doughnut', //this denotes tha type of chart
      data: {// values on X-Axis
          labels: ['CGPA', '', ],
          datasets: [{
            data: [3.3, 4-3.3],
            backgroundColor: ['#F56423','gray',]
          }],
      },
      options: {
        aspectRatio: 1.5
      }
    });
  }

  createEGPAchart(){
    this.EGPAchart = new Chart("EGPAchart", {
      type: 'doughnut', //this denotes tha type of chart
      data: {// values on X-Axis
          labels: ['EGPA', '', ],
          datasets: [{
            data: [3.7, 4-3.7],
            backgroundColor: ['#F56423','gray',]
          }],
      },
      options: {
        aspectRatio: 1.5
      }
    });
  }

  createProgressChart(){
    this.progressChart = new Chart("progressChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['0', '4', '8', '12', '16 (weeks)' ], 
	       datasets: [
          {
            label: "Course 1",
            data: ['67','78', '83', '75', '92',],
            backgroundColor: 'blue'
          },
          {
            label: "Course 2",
            data: ['30', '86', '45', '70', '80',],
            backgroundColor: 'black'
          },
          {
            label: "Course 3",
            data: ['90','70', '94', '97', '100',],
            backgroundColor: 'red'
          },
          {
            label: "Course 4",
            data: ['80','74', '85', '72', '96',],
            backgroundColor: 'orange'
          } 
        ]
      },
      options: {
        aspectRatio: 2
      }
    });
  }

}
