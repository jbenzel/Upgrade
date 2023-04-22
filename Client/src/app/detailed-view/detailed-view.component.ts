import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto'
import { GradeCalcService } from 'app/services/grade-calc.service';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Apollo, QueryRef, gql } from 'apollo-angular';
import { UserService } from 'app/services/user.service';
import { Subscription } from 'rxjs';
import Notify from 'simple-notify'

const GET_COURSE_BY_COURSE_ID = gql`
query Query($courseIdParam: ID!) {
  getCoursebyCourseID(courseIDParam: $courseIdParam) {
    courseCode
    courseID
    courseName
    courseNum
    credits
    userID
  }
}
`;

const GET_ALL_GRADES_BY_USER_ID = gql`
query GetAllGradesbyUserID($userIdParam: ID!) {
  getAllGradesbyUserID(userIDParam: $userIdParam) {
    category
    courseID
    dueDate
    expectedGrade
    grade
    gradeID
    locked
    name
    urgency
    userID
    weight
    history
  }
}
`;

const ADD_GRADE = gql`
mutation Mutation($name: String, $dueDate: String, $expectedGrade: Float, $grade: Float, $category: String, $weight: Float, $urgency: Int, $locked: Boolean, $courseId: ID!, $userId: ID!, $history: Boolean) {
  addGrade(name: $name, dueDate: $dueDate, expectedGrade: $expectedGrade, grade: $grade, category: $category, weight: $weight, urgency: $urgency, locked: $locked, courseID: $courseId, userID: $userId, history: $history) {
    weight
    userID
    urgency
    name
    locked
    history
    gradeID
    grade
    expectedGrade
    dueDate
    courseID
    category
  }
}
`;

const UPDATE_GRADE = gql`
mutation Mutation($expectedGrade: Float, $gradeIdParam: ID!, $courseId: ID!, $userId: ID!, $locked: Boolean, $grade: Float, $history: Boolean) {
  updateGrade(expectedGrade: $expectedGrade, gradeIDParam: $gradeIdParam, courseID: $courseId, userID: $userId, locked: $locked, grade: $grade, history: $history) {
    expectedGrade
    category
    courseID
    dueDate
    grade
    gradeID
    locked
    name
    urgency
    userID
    weight
    history
  }
}
`;

const DELETE_GRADE = gql`
mutation Mutation($gradeIdParam: ID!) {
  deleteGrade(gradeIDParam: $gradeIdParam) {
    category
    courseID
    dueDate
    expectedGrade
    grade
    gradeID
    history
    locked
    name
    urgency
    userID
    weight
  }
}
`;

@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements OnInit {
  @ViewChild(MatTable) table: any;
  getAllGradesQuery!: QueryRef<any>;
  clickEventSubscription: Subscription;
  public chart: any;
  timeout: any = null;
  displayedColumns: string[] = ['category', 'name', 'grade', 'dueDate'];
  gradesHistoryDataSource = [];
  gradesDataSource: any = [];
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
  courseName;
  courseNum;

  constructor(private calc: GradeCalcService, private user: UserService, public dialog: MatDialog, private apollo: Apollo) {
    this.clickEventSubscription = this.calc.getClickEvent().subscribe(() => {
      this.addGradeTrigger();
    })
  }

  ngOnInit(): void {
    //Set Course Name and Number
    this.apollo.watchQuery<any>({
      query: GET_COURSE_BY_COURSE_ID,
      variables: {
        "courseIdParam": this.user.courseID
      }
    }).valueChanges.subscribe(({ data }) => {
      //console.log(data)
      this.courseName = data["getCoursebyCourseID"].courseName;
      this.courseNum = data["getCoursebyCourseID"].courseCode;
    });

    this.getAllGradesQuery = this.apollo.watchQuery<any>({
      query: GET_ALL_GRADES_BY_USER_ID,
      variables: {
        "userIdParam": this.user.userID
      }
    });

    this.populateDataSource();


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
          backgroundColor: ['#004990', '#FF8C58', '#028090', '#569BBE', '#114B5F',],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }

  populateDataSource() {
    this.apollo.watchQuery<any>({
      query: GET_ALL_GRADES_BY_USER_ID,
      variables: {
        "userIdParam": this.user.userID
      }
    }).valueChanges.subscribe(({ data }) => {
      //console.log(data)
      this.gradesHistoryDataSource = [];
      this.gradesDataSource = [];
      data["getAllGradesbyUserID"].forEach(grade => {
        //console.log(grade);
        let lockedColor;
        let lockedToolTip;
        if (grade.locked) {
          lockedColor = "#3498DBbb";
          lockedToolTip = "Unlock Grade";
        }
        else {
          lockedColor = "#D1D1D1";
          lockedToolTip = "Lock Grade";
        }
        if (grade.courseID == this.user.courseID) {
          console.log(grade)
          console.log(grade.courseID)
          if (grade.history) {
            this.gradesHistoryDataSource.push({ "id": grade.gradeID, "category": grade.category, "weight": grade.weight, "name": grade.name, "grade": grade.grade, "dueDate": grade.dueDate });
          }
          else {
            this.gradesDataSource.push({ "id": grade.gradeID, "category": grade.category, "weight": grade.weight, "name": grade.name, "grade": grade.expectedGrade, "dueDate": grade.dueDate, "locked": grade.locked, "lockedColor": lockedColor, "lockedToolTip": lockedToolTip });
          }
        }
      });
      this.table.renderRows();
      this.updateDonughtChart();
      this.valueChange("event", -1);
    });
  }

  updateGrades() {
    this.gradesDataSource.forEach(grade => {
      this.apollo.mutate({
        mutation: UPDATE_GRADE,
        variables: {
          "expectedGrade": grade.grade,
          "gradeIdParam": grade.id,
          "courseId": this.user.courseID,
          "userId": this.user.userID,
        },
      }).subscribe(({ data }) => {
      });
    });
  }

  addGradeTrigger() {
    this.getAllGradesQuery.refetch();
    this.populateDataSource();
    this.valueChange("event", -1);
  }

  addGradePopup() {
    const dialogRef = this.dialog.open(AddGradePopup);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  updateAverages() {
    this.courseAverage = String(this.calc.courseGrade(this.gradesHistoryDataSource).toFixed(0)) + "%";
    this.expectedCourseAverage = String(this.calc.courseExpectedGrade(this.gradesHistoryDataSource, this.gradesDataSource).toFixed(0)) + "%";
    //console.log(this.courseAverage)
    //console.log(this.expectedCourseAverage)
  }

  notify(){
    new Notify ({
      status: 'error',
      title: 'Notify Title',
      text: 'Value Entered was Too Low',
      effect: 'fade',
      speed: 300,
      customClass: '',
      customIcon: '',
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 3000,
      gap: 20,
      distance: 20,
      type: 1,
      position: 'right top'
    })
  }

  //Triggered on Slider Value Change
  valueChange($event, i) {
    //console.log("Value Change")
    //console.log($event, i);
    //If Changed Grade, Lock Grade
    if (i != -1 && this.gradesDataSource[i].locked == false) {
      this.toggleLockGrade($event, i);
    }

    //Refreshes Future Grades with Even Distribution
    let updatedTable: any = this.calc.disributeCourseGrades(this.gradesHistoryDataSource, this.gradesDataSource, i);
    if (updatedTable == "Error") {
      this.gradesDataSource = this.oldGradesDataSource;
      this.notify();
    }
    else {
      this.gradesDataSource = updatedTable;
    }
    this.updateAverages();
    this.updateGrades();
    this.oldGradesDataSource = JSON.parse(JSON.stringify(this.gradesDataSource));
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
      this.valueChange("event", -1);
    }
    else {
      this.gradesDataSource[i].locked = true;
      this.gradesDataSource[i].lockedColor = "#3498DBbb";
      this.gradesDataSource[i].lockedToolTip = "Unlock Grade";
    }

    this.apollo.mutate({
      mutation: UPDATE_GRADE,
      variables: {
        "locked": this.gradesDataSource[i].locked,
        "gradeIdParam": this.gradesDataSource[i].id,
        "courseId": this.user.courseID,
        "userId": this.user.userID,
      },
    }).subscribe(({ data }) => {
    });
  }

  deleteGrade($event, i) {
    //console.log($event, i);
    this.apollo.mutate({
      mutation: DELETE_GRADE,
      variables: {
        "gradeIdParam": this.gradesDataSource[i].id,
      },
    }).subscribe(({ data }) => {
    });
    this.gradesDataSource.splice(i, 1);
    this.calc.disributeCourseGrades(this.gradesHistoryDataSource, this.gradesDataSource, -1);
  }

  //Removes Grade from Future Grades, Adds to Past Grades
  moveToPastGrades($event, i) {
    //console.log($event, i);
    this.apollo.mutate({
      mutation: UPDATE_GRADE,
      variables: {
        "history": true,
        "gradeIdParam": this.gradesDataSource[i].id,
        "courseId": this.user.courseID,
        "userId": this.user.userID,
        "grade": this.gradesDataSource[i].grade
      },
    }).subscribe(({ data }) => {
    });
    this.gradesHistoryDataSource.push(this.gradesDataSource[i]);
    this.gradesDataSource.splice(i, 1);
    this.table.renderRows();
    this.updateAverages();
    this.updateDonughtChart();
  }

  //Refreshes Donught Chart
  updateDonughtChart() {
    this.donutChartDataSource.Homework = 0;
    this.donutChartDataSource.Assignment = 0;
    this.donutChartDataSource.Project = 0;
    this.donutChartDataSource.Exam = 0;
    this.donutChartDataSource.Other = 0;

    this.gradesHistoryDataSource.forEach(grade => {
      //console.log(grade.category);
      if (grade.category == "Homework") {
        this.donutChartDataSource.Homework += grade.grade;
      }
      else if (grade.category == "Assignment") {
        this.donutChartDataSource.Assignment += grade.grade;
      }
      else if (grade.category == "Project") {
        this.donutChartDataSource.Project += grade.grade;
      }
      else if (grade.category == "Exam") {
        this.donutChartDataSource.Exam += grade.grade;
      }
      else {
        this.donutChartDataSource.Other += grade.grade;
      }
    });

    if (this.chartInitialized) {
      this.chart.data.datasets[0].data = Object.values(this.donutChartDataSource);
      this.chart.update();
      this.chart.render();
    }
    else {
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

@Component({
  selector: 'add-grade-popup',
  templateUrl: 'add-grade-popup.html',
})
export class AddGradePopup implements OnInit {
  category = [
    "Homework",
    "Assignment",
    "Project",
    "Exam",
    "Other",
  ];
  gradeName;
  gradeCategory;
  gradeDate;
  gradeWeight;

  constructor(private user: UserService, private calc: GradeCalcService, private apollo: Apollo) { }

  ngOnInit(): void {
  }

  addGrade() {
    //console.log("Name   "     + this.gradeName);
    //console.log("Category   " + this.gradeCategory);
    //console.log("Date   "     + this.gradeDate);
    //console.log("Weight   "   + this.gradeWeight);
    if (this.gradeName != undefined && this.gradeCategory != undefined && this.gradeDate != undefined && this.gradeWeight != undefined) {
      let formattedDate;
      let monthStr = (this.gradeDate.toString()).substr(4, 3);
      let month;
      let day = (this.gradeDate.toString()).substr(8, 2);
      let year = (this.gradeDate.toString()).substr(11, 4);
      if (monthStr == "Jan") {
        month = "01"
      }
      else if (monthStr == "Feb") {
        month = "02"
      }
      else if (monthStr == "Mar") {
        month = "03"
      }
      else if (monthStr == "Apr") {
        month = "04"
      }
      else if (monthStr == "May") {
        month = "05"
      }
      else if (monthStr == "Jun") {
        month = "06"
      }
      else if (monthStr == "Jul") {
        month = "07"
      }
      else if (monthStr == "Aug") {
        month = "08"
      }
      else if (monthStr == "Sep") {
        month = "09"
      }
      else if (monthStr == "Oct") {
        month = "10"
      }
      else if (monthStr == "Nov") {
        month = "11"
      }
      else if (monthStr == "Dec") {
        month = "12"
      }

      formattedDate = month + "/" + day + "/" + year;
      //console.log(formattedDate);
      //this.gradeDate = 

      this.apollo.mutate({
        mutation: ADD_GRADE,
        variables: {
          "userId": (this.user.userID).toString(),
          "courseId": (this.user.courseID).toString(),
          "locked": false,
          "urgency": 0,
          "weight": Number(this.gradeWeight),
          "category": (this.gradeCategory).toString(),
          "grade": null,
          "expectedGrade": 0,
          "dueDate": (formattedDate).toString(),
          "name": (this.gradeName).toString(),
          "history": false
        },
      }).subscribe(({ data }) => {
        //console.log('got data', data);
        this.calc.sendClickEvent();
      });
    }
  }
}