import { Component, OnInit } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider'; 
import * as Chartist from 'chartist';
import { Chart, ChartData, ChartEvent, ChartType } from 'chart.js';
// import { PieChart } from 'chartist';

//let userCPGA = (document.getElementById("CPGA") as HTMLInputElement).value;

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  currentUser = {
    'CGPA': 3.0,
    'EGPA': 3.5,
  };

  constructor() { }
  ngOnInit(): void {
    this.createCGPAchart();
    this.createEGPAchart();
    this.createProgressChart();
  }

  public CGPAchart: any;
  public EGPAchart: any;
  public progressChart: any;
  public CGPAchartData: any = {
    labels: ['CGPA', '', ],
    datasets: [{
      data: [this.currentUser.CGPA, 4-this.currentUser.CGPA],
      backgroundColor: ['#F56423','gray',]
    }],
  };

  public EGPAchartData: any = {
    labels: ['CGPA', '', ],
    datasets: [{
      data: [this.currentUser.EGPA, 4-this.currentUser.EGPA],
      backgroundColor: ['#F56423','gray',]
    }],
  };

  createCGPAchart(){
    this.CGPAchart = new Chart("CGPAchart", {
      type: 'doughnut', //this denotes tha type of chart
      data: this.CGPAchartData,
      options: {
        aspectRatio: 2,
        maintainAspectRatio: false,
      }
    });
  }

  createEGPAchart(){
    this.EGPAchart = new Chart("EGPAchart", {
      type: 'doughnut', //this denotes tha type of chart
      data: this.EGPAchartData,
      options: {
        aspectRatio: 2,
        maintainAspectRatio: false,
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
            label: "1",
            data: ['72','78', '83', '75', '92',],
            backgroundColor: '#F56423',
            borderColor: '#F56423',
            pointBackgroundColor: '#F56423',
            pointHoverBackgroundColor: '#F56423',
            pointRadius: 5
          },
          {
            label: "2",
            data: ['70', '86', '75', '70', '80',],
            backgroundColor: '#569BBE',
            borderColor: '#569BBE',
            pointBackgroundColor: '#569BBE',
            pointHoverBackgroundColor: '#569BBE',
            pointRadius: 5
          },
          {
            label: "3",
            data: ['90','70', '94', '97', '100',],
            backgroundColor: '#707070',
            borderColor: '#707070',
            pointBackgroundColor: '#707070',
            pointHoverBackgroundColor: '#707070',
            pointRadius: 5
          },
          {
            label: "4",
            data: ['80','74', '85', '72', '96',],
            backgroundColor: '#004990',
            borderColor: '#004990',
            pointBackgroundColor: '#004990',
            pointHoverBackgroundColor: '#004990',
            pointRadius: 5
          } 
        ]
      },
      options: {
        aspectRatio: 2,
        maintainAspectRatio: false,
      }
    });
  }

}
