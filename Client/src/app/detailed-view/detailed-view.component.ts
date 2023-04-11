import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto'
import { GradeCalcService } from 'app/services/grade-calc.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements OnInit {
  @ViewChild(MatTable) table: any;
  public chart: any;
  timeout: any = null;
  displayedColumns: string[] = ['category', 'name', 'grade', 'dueDate'];
  gradesHistoryDataSource = [
    { "category": "Other", "weight": 0.70, "name": "Proposal Presentation", "grade": 80, "dueDate": "02/15/23" },
    { "category": "Assignment", "weight": 0.30, "name": "Proposal Report", "grade": 80, "dueDate": "02/22/23" },
    { "category": "Exam", "weight": 0.70, "name": "Exam 1", "grade": 70, "dueDate": "02/27/23" },
  ];
  gradesDataSource = [
    { "category": "Other", "weight": 0.30, "name": "Presentation", "grade": 93.769, "dueDate": "03/20/23", "min": 0, "locked": false, "lockedColor": "#D1D1D1", "lockedToolTip": "Lock Grade" },
    { "category": "Exam", "weight": 0.30, "name": "Exam 2", "grade": 93.769, "dueDate": "03/27/23", "min": 0, "locked": false, "lockedColor": "#D1D1D1", "lockedToolTip": "Lock Grade" },
    { "category": "Other", "weight": 0.70, "name": "Final Presentation", "grade": 75, "dueDate": "04/24/23", "min": 0, "locked": true, "lockedColor": "#3498DBbb", "lockedToolTip": "Unlock Grade" },
    { "category": "Other", "weight": 0.70, "name": "Final Project code and Report", "grade": 93.769, "dueDate": "04/05/23", "min": 0, "locked": false, "lockedColor": "#D1D1D1", "lockedToolTip": "Lock Grade" },
  ];
  oldGradesDataSource = [];
  courseAverage;
  expectedCourseAverage;
  donutChartDataSource = {
    'Homework': 1,
    'Assignment': 1,
    'Project': 1,
    'Exam': 1,
    'Other': 1,
  }
  chartInitialized = false;

  constructor(private calc: GradeCalcService) { }

  ngOnInit(): void {
    this.oldGradesDataSource = JSON.parse(JSON.stringify(this.gradesDataSource));
    this.updateAverages(); // Updates Goal and Actual Course Average
    this.updateDonughtChart(); //Refreshess Data and ReRenders Donught Chart
    this.chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {
        labels: Object.keys(this.donutChartDataSource),
        datasets: [{
          label: 'Past Grade Points',
          data: Object.values(this.donutChartDataSource),
          
          hoverOffset: 4
        }]
      },
      options: {
      }
    });

  }

  updateAverages() {
    this.courseAverage = String(this.calc.courseGrade(this.gradesHistoryDataSource).toFixed(0)) + "%";
    this.expectedCourseAverage = String(this.calc.courseExpectedGrade(this.gradesHistoryDataSource, this.gradesDataSource).toFixed(0)) + "%";
    //console.log(this.courseAverage)
    //console.log(this.expectedCourseAverage)
  }

  //Triggered on Slider Value Change
  valueChange($event, i) {
    this.oldGradesDataSource = JSON.parse(JSON.stringify(this.gradesDataSource));
    //console.log("Value Change")
    //console.log($event, i);
    //If Changed Grade, Lock Grade
    if (this.gradesDataSource[i].locked == false) {
      this.toggleLockGrade($event, i);
    }

    //Refreshes Future Grades with Even Distribution
    this.gradesDataSource = this.calc.disributeCourseGrades(this.gradesHistoryDataSource, this.gradesDataSource, i);
    this.updateAverages();
  }

  textboxChange($event, i) {
    //console.log($event, i);
    var $this = this;
    clearTimeout(this.timeout);
    let oldGrade = parseFloat(String(this.oldGradesDataSource[i].grade));
    let newGrade = parseFloat(String(this.gradesDataSource[i].grade));
    //console.log(oldGrade)
    //console.log(newGrade)
    //console.log("\n\n")

    //Triggers After New Data Entered with Pause After
    this.timeout = setTimeout(function () {
      if (oldGrade != newGrade) {
        //console.log($event.target.value, i);
        $this.valueChange($event.target.value, i);
      }
    }, 500);
  }

  //Changes Lock Button Color and ToolTip
  toggleLockGrade($event, i) {
    //console.log($event, i);
    if (this.gradesDataSource[i].locked == true) {
      this.gradesDataSource[i].locked = false;
      this.gradesDataSource[i].lockedColor = "#D1D1D1";
      this.gradesDataSource[i].lockedToolTip = "Lock Grade";
    }
    else {
      this.gradesDataSource[i].locked = true;
      this.gradesDataSource[i].lockedColor = "#3498DBbb";
      this.gradesDataSource[i].lockedToolTip = "Unlock Grade";
    }
  }

  deleteGrade($event, i) {
    //console.log($event, i);
    this.gradesDataSource.splice(i,1);
    this.calc.disributeCourseGrades(this.gradesHistoryDataSource, this.gradesDataSource, -1);
  }

  //Removes Grade from Future Grades, Adds to Past Grades
  moveToPastGrades($event, i) {
    //console.log($event, i);
    this.gradesHistoryDataSource.push(this.gradesDataSource[i]);
    this.gradesDataSource.splice(i,1);
    this.table.renderRows();
    this.updateAverages();
    this.updateDonughtChart();
  }

  //Refreshes Donught Chart
  updateDonughtChart(){
    this.donutChartDataSource.Homework = 0;
    this.donutChartDataSource.Assignment = 0;
    this.donutChartDataSource.Project = 0;
    this.donutChartDataSource.Exam = 0;
    this.donutChartDataSource.Other = 0;

    this.gradesHistoryDataSource.forEach(grade => {
      //console.log(grade.category);
      if(grade.category == "Homework"){
        this.donutChartDataSource.Homework += grade.grade;
      }
      else if(grade.category == "Assignment"){
        this.donutChartDataSource.Assignment += grade.grade;
      }
      else if(grade.category == "Project"){
        this.donutChartDataSource.Project += grade.grade;
      }
      else if(grade.category == "Exam"){
        this.donutChartDataSource.Exam += grade.grade;
      }
      else{
        this.donutChartDataSource.Other += grade.grade;
      }
    });

    if(this.chartInitialized){
      this.chart.data.datasets[0].data = Object.values(this.donutChartDataSource);
      this.chart.update();
      this.chart.render();
    }
    else{
      this.chartInitialized = true;
    }
  }

  createPieChart() {
    this.chart = new Chart("MyChart", {
      type: 'doughnut', //this denotes tha type of chart

      data: {// values on X-Axis
        datasets: [{
          data: [60, 10, 10, 5, 5, 10],
          backgroundColor: [
            'red',
            'pink',
            'green',
            'yellow',
            'orange',
            'blue',
          ],
          hoverOffset: 4
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 2.5
      }
    });
  }

}