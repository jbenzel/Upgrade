import { Component, OnInit, OnChanges, SimpleChanges, Input, HostListener, ViewChild, ViewChildren, ChangeDetectorRef, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import * as userInfo from './student-info.json';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { CONNREFUSED } from 'dns';
import { UserService } from 'app/services/user.service';
import { GradeCalcService } from 'app/services/grade-calc.service';

const GET_ALL_USERS = gql`
query GetAllUser {
  getAllUser {
    userID
    email
    password
    role
    firstName
    lastName
  }
}
`;
const GET_A_STUDENT = gql`
query GetStudentbyUserID($userIdParam: Int) {
  getStudentbyUserID(userIDParam: $userIdParam) {
    studentID
    eGPA
    cGPA
    completedCourseCount
    userID
  }
}
`;
const GET_ALL_COURSES = gql`
query GetAllCoursesbyUserID($userIdParam: ID!) {
  getAllCoursesbyUserID(userIDParam: $userIdParam) {
    courseID
    courseName
    courseCode
    courseNum
    credits
    userID
  }
}
`;
const GET_ALL_PREV_COURSES = gql`
query Query($userIdParam: ID!) {
  getAllPrevCoursebyUserID(userIDParam: $userIdParam) {
    pCourseCredits
    pCourseGrade
    pCourseName
    pCourseNum
    prevCourseID
    userID
  }
}
`;
const GET_ALL_GRADES = gql`
query GetAllGradesbyUserID($userIdParam: ID!) {
  getAllGradesbyUserID(userIDParam: $userIdParam) {
    gradeID
    name
    dueDate
    expectedGrade
    grade
    category
    weight
    urgency
    locked
    courseID
    userID
    history
  }
}
`;
const UPDATE_EGPA = gql`
mutation Mutation($studentIdParam: ID!, $userId: Int!, $eGpa: Float) {
  updateStudent(studentIDParam: $studentIdParam, userID: $userId, eGPA: $eGpa) {
    userID
    studentID
    eGPA
  }
}
`;
const UPDATE_CGPA = gql`
mutation Mutation($studentIdParam: ID!, $userId: Int!, $cGpa: Float) {
  updateStudent(studentIDParam: $studentIdParam, userID: $userId, cGPA: $cGpa) {
    userID
    studentID
    cGPA
  }
}
`;
@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  getAllSOVQuery!: QueryRef<any>;
  getStudentQuery!: QueryRef<any>;

  public currentUser: any = {
    //TEMP Values - (Is updated to users values)
    "eGPA":0,
    "cGPA":0
  };
  public courseList: any;
  public gradesList: any;
  public newCourseList: any[] = [];
  public newGradesList: any[] = [];
  public mergedList: any;
  public CGPA: number;
  public EGPA: number;
  prevCourses = [];
  maxGPA;

  constructor(private apollo: Apollo, private user: UserService, private calc: GradeCalcService) { }
  ngOnInit(): void {
    this.getAllSOVQuery = this.apollo.watchQuery<any>({
      query: GET_ALL_USERS,
    });

    this.getStudentQuery = this.apollo.watchQuery<any>({
      query: GET_A_STUDENT,
      variables: {
        "userIdParam": (Number)(this.user.userID)
      }
    });

    this.getStudent();
    this.getCourses();
    this.getPrevCourses();
    this.getGrades();

    this.mappingGrades();
  }

  goToCourse(course){
    this.user.courseID = course;
  }

  // start querying student
  getStudent() {
    this.apollo.watchQuery<any>({
      query: GET_A_STUDENT,
      variables: {
        "userIdParam": (Number)(this.user.userID)
      }
    }).valueChanges
      .subscribe(({ data }) => {
        this.currentUser = data.getStudentbyUserID;
        this.user.currentGPA = Number(data.getStudentbyUserID.cGPA);
        this.user.estimatedGPA = Number(data.getStudentbyUserID.eGPA);

        this.createCGPAChart('current');
        this.createEGPAChart('estm');
      });

    this.getAllSOVQuery.refetch();
  }
  // end querying student

  // start querying all course
  getCourses() {
    this.apollo.watchQuery<any>({
      query: GET_ALL_COURSES,
      variables: {
        "userIdParam": this.user.userID
      }
    }).valueChanges
      .subscribe(({ data }) => {
        this.courseList = data.getAllCoursesbyUserID;
        // console.log(this.courseList);

        data.getAllCoursesbyUserID.forEach(course => {
          this.newCourseList.push(course);
        });
      });

    this.getAllSOVQuery.refetch();
  }

  getPrevCourses(){
    this.apollo.watchQuery<any>({
      query: GET_ALL_PREV_COURSES,
      variables: {
        "userIdParam": this.user.userID
      }
    }).valueChanges
      .subscribe(({ data }) => {
        //console.log("getPrevCourses",data.getAllPrevCoursebyUserID);
        this.prevCourses = data.getAllPrevCoursebyUserID;
        this.updateCurrentGPA(this.calc.getCurrentGPA(data.getAllPrevCoursebyUserID));
      });
  }
  // end querying all course

  updateCurrentGPA(cGpa){
    this.apollo.mutate({
      mutation: UPDATE_CGPA,
      variables: {
        "userId": this.user.userID,
        "studentIdParam": this.user.userID,
        "cGpa": Number(cGpa)
      },
    }).subscribe(({ data }) => {
      this.user.currentGPA = Number(cGpa);
    });
    this.getStudentQuery.refetch();
  }

  // start querying all grades
  getGrades() {
    this.apollo.watchQuery<any>({
      query: GET_ALL_GRADES,
      variables: {
        "userIdParam": this.user.userID
      }
    }).valueChanges
      .subscribe(({ data }) => {
        this.gradesList = data.getAllGradesbyUserID;

        data.getAllGradesbyUserID.forEach(grade => {
          this.newGradesList.push(grade);
        });
        //console.log("Grade List",this.newGradesList);
        setTimeout (() => {
          this.getGPAMax(data);
        }, 1000);
      });

    this.getAllSOVQuery.refetch();
  }
  // end querying all grades

  getGPAMax(data){
    //Orders Grades Into a List of Grades by Users Course
    let tempGradeList = [];
    let tempCourseGradeList = [];
    let courseGradeID = data.getAllGradesbyUserID[0].courseID;
    this.newGradesList.forEach(grade => {
      if(courseGradeID == grade.courseID){
        tempCourseGradeList.push(grade);
      }
      else{
        //console.log(tempCourseGradeList);
        tempGradeList.push(tempCourseGradeList);
        tempCourseGradeList = [];
        tempCourseGradeList.push(grade);
      }
      if(this.newGradesList[this.newGradesList.length-1] == grade){
        //console.log(tempCourseGradeList);
        tempGradeList.push(tempCourseGradeList);
      }
      courseGradeID = grade.courseID;
    });

    let maxAverageCoursesAndPrevCourses = [];
    maxAverageCoursesAndPrevCourses = this.calc.getMaxAverage(tempGradeList, this.courseList);
    maxAverageCoursesAndPrevCourses = maxAverageCoursesAndPrevCourses.concat(this.prevCourses);
    //console.log("maxAverageCoursesAndPrevCourses",maxAverageCoursesAndPrevCourses);
    this.maxGPA = (Math.trunc((this.calc.getCurrentGPA(maxAverageCoursesAndPrevCourses))*100)/100)
    //console.log(this.maxGPA)
  }

  // start mapping grades to corresponsing course
  mappingGrades() {
    this.apollo.watchQuery<any>({
      query: GET_ALL_COURSES,
      variables: {
        "userIdParam": this.user.userID
      }
    }).valueChanges
      .subscribe((courses) => {

        this.apollo.watchQuery<any>({
          query: GET_ALL_GRADES,
          variables: {
            "userIdParam": this.user.userID
          }
        }).valueChanges.subscribe((grades) => {

          // Merging two arrays
          this.mergedList = courses.data.getAllCoursesbyUserID.map(course => {
            const matchingItem = grades.data.getAllGradesbyUserID.filter((grade) => course.courseID === grade.courseID);
            return {
              ...course,
              gradeslist: matchingItem
              // ? [matchingItem] : []
            };
          });
          //console.log(this.mergedList);
          //console.log(this.currentUser);

          this.createProgressChart('progressChart');
        });
      });

    this.getAllSOVQuery.refetch();
  }
  // end mapping grades to corresponsing course

  // start urgency level for tooltip
  getUrgencyLevel(urgency: number): string {
    if (urgency === 4) {
      return "Urgent";
    } else if (urgency === 3) {
      return "Critical";
    } else if (urgency === 2) {
      return "Alarming";
    } else if (urgency === 1) {
      return "Act soon";
    } else {
      return "Low";
    }
  }
  // end urgency level for tooltip

  // chart variables
  public EGPAchart: any;
  public CGPAchart: any;
  public progressChart: any;
  public afterEGPA: number;
  public afterCGPA: number;

  // start updating Estimated GPA Donut Chart
  updateEstmatedChartData() {
    // Update the chart data with the new value
    const newGPA = [Number(this.afterEGPA), 4 - this.afterEGPA];

    //console.log(this.EGPAchart);
    this.EGPAchart.data.datasets[0].data = newGPA;

    // Update the chart properties with the modified data
    this.EGPAchart.update();
    this.EGPAchart.render();

    // updating EGPA in database after user input
    this.apollo.mutate({
      mutation: UPDATE_EGPA,
      variables: {
        "userId": this.user.userID,
        "studentIdParam": this.user.userID,
        "eGpa": Number(this.afterEGPA)
      },
    }).subscribe(({ data }) => {
      this.getStudentQuery.refetch();
    });

  }
  // end updating Estimated GPA Donut Chart

  // start creating Estimated GPA Donut Chart
  createEGPAChart(chartId) {
    this.EGPAchart = new Chart(chartId, {
      type: 'doughnut',
      data: {
        labels: ['EGPA', ''],
        datasets: [
          {
            data: [this.currentUser.eGPA, 4 - this.currentUser.eGPA],
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
  // end creating Estimated GPA Donut Chart

  // start creating Current GPA Donut Chart
  createCGPAChart(chartId) {
    this.CGPAchart = new Chart(chartId, {
      type: 'doughnut',
      data: {
        labels: ['CGPA', ''],
        datasets: [
          {
            data: [this.currentUser.cGPA, 4 - this.currentUser.cGPA],
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
  // end creating Current GPA Donut Chart

  // start creating Progress Line Chart
  createProgressChart(chartId) {
    this.progressChart = new Chart(chartId, {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['0', '4', '8', '12', '16 (weeks)'],
        datasets: [
          {
            label: this.mergedList[0].courseCode,
            data: ['72', '78', '83', '75', '92',],
            backgroundColor: '#F56423',
            borderColor: '#F56423',
            pointBackgroundColor: '#F56423',
            pointHoverBackgroundColor: '#F56423',
            pointRadius: 5
          },
          {
            label: this.mergedList[1].courseCode,
            data: ['70', '86', '75', '70', '80',],
            backgroundColor: '#569BBE',
            borderColor: '#569BBE',
            pointBackgroundColor: '#569BBE',
            pointHoverBackgroundColor: '#569BBE',
            pointRadius: 5
          },
          {
            label: this.mergedList[2].courseCode,
            data: ['90', '70', '94', '97', '100',],
            backgroundColor: '#707070',
            borderColor: '#707070',
            pointBackgroundColor: '#707070',
            pointHoverBackgroundColor: '#707070',
            pointRadius: 5
          },{
            label: this.mergedList[3].courseCode,
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
  // end creating Progress Line Chart

}
