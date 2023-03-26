import { Component, OnInit, OnChanges, SimpleChanges, Input,HostListener, ViewChild, ViewChildren, ChangeDetectorRef, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
// import { data } from 'jquery';
// import { NgChartsModule, NgChartsConfiguration, BaseChartDirective } from 'ng2-charts';
import * as userInfo from './student-info.json';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit, AfterViewInit {

  constructor() {}
  ngOnInit(): void {}
  
  public EGPAchart: any;
  public CGPAchart: any;
  public progressChart: any;
  public afterEGPA: number;
  public afterCGPA: number;

  current = userInfo;
  CGPA = this.current.currentUser.getAllStudent[0].cGPA;
  EGPA = this.current.currentUser.getAllStudent[0].eGPA;

  ngAfterViewInit() {
    this.createProgressChart('progressChart');
    this.createEGPAChart('estm');
    this.createCGPAChart('current');
  }

  updateCurrChartData() {
    // Update the chart data with the new value
    const newGPA = [Number(this.afterCGPA), 4 - this.afterCGPA];

    console.log(this.CGPAchart);
    this.CGPAchart.data.datasets[0].data = newGPA;

    // Update the chart properties with the modified data
    this.CGPAchart.update();
    this.CGPAchart.render();
  }

  updateEstmatedChartData() {
    // Update the chart data with the new value
    const newGPA = [Number(this.afterEGPA), 4 - this.afterEGPA];

    console.log(this.EGPAchart);
    this.EGPAchart.data.datasets[0].data = newGPA;

    // Update the chart properties with the modified data
    this.EGPAchart.update();
    this.EGPAchart.render();
  }

  createEGPAChart(chartId) {
    this.EGPAchart = new Chart(chartId, {
      type: 'doughnut',
      data: {
        labels: ['EGPA', ''],
        datasets: [
          {
            data: [this.EGPA, 4 - this.EGPA],
            backgroundColor: ['#F56423', '#707070'],
            hoverBackgroundColor: ['#F56423', '#707070']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createCGPAChart(chartId) {
    this.CGPAchart = new Chart(chartId, {
      type: 'doughnut',
      data: {
        labels: ['CGPA', ''],
        datasets: [
          {
            data: [this.CGPA, 4 - this.CGPA],
            backgroundColor: ['#F56423', '#707070'],
            hoverBackgroundColor: ['#F56423', '#707070']
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  createProgressChart(chartId){
    this.progressChart = new Chart(chartId, {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['0', '4', '8', '12', '16 (weeks)' ], 
	       datasets: [
          {
            label: this.current.currentUser.getAllCourse[0].courseCode,
            data: ['72','78', '83', '75', '92',],
            backgroundColor: '#F56423',
            borderColor: '#F56423',
            pointBackgroundColor: '#F56423',
            pointHoverBackgroundColor: '#F56423',
            pointRadius: 5
          },
          {
            label: this.current.currentUser.getAllCourse[1].courseCode,
            data: ['70', '86', '75', '70', '80',],
            backgroundColor: '#569BBE',
            borderColor: '#569BBE',
            pointBackgroundColor: '#569BBE',
            pointHoverBackgroundColor: '#569BBE',
            pointRadius: 5
          },
          {
            label: this.current.currentUser.getAllCourse[2].courseCode,
            data: ['90','70', '94', '97', '100',],
            backgroundColor: '#707070',
            borderColor: '#707070',
            pointBackgroundColor: '#707070',
            pointHoverBackgroundColor: '#707070',
            pointRadius: 5
          },
          {
            label: this.current.currentUser.getAllCourse[3].courseCode,
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
        aspectRatio: 1,
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

}
