import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeCalcService {
  private subject = new Subject<any>();

  sendClickEvent(){
    this.subject.next("");

  }

  getClickEvent():Observable<any>{
     return this.subject.asObservable();
  }

  constructor(private user: UserService) { }

  //  disributeCourseGrades(grades: any, changedGrade: any){
  //    let newGrades;
  //    let unlockedGradeArray;
  //    let courseGpa = this.user.currentGPA * 25;
  //    let sumOfGrades = 0;
  //    let sumOfUnlockedGrades = 0;
  //    let gradeTotalDifference = 0;
  //    let gradesNum = 0;
  //    let unlockedGradesNum = 0;
  //    let percentageOfTotalArray;
  //    
  //    //Gets Sum of Grades and New Unlocked Grades Array
  //    grades.forEach(grade => {
  //      gradesNum++;
  //      sumOfGrades += grade.grade;
  //      if(!grade.locked && !changedGrade){
  //        unlockedGradeArray.push(grade);
  //        unlockedGradesNum++;
  //      }
  //    });
  //
  //    //Sum of All Unlocked Grades
  //    unlockedGradeArray.forEach(grade => {
  //      sumOfUnlockedGrades += grade;
  //    });
  //
  //    //Difference of Grades Sum - (All - Unl)
  //    gradeTotalDifference = sumOfGrades - (sumOfGrades - sumOfUnlockedGrades);
  //
  //    //Creates Percentages of Grades to Total
  //    unlockedGradeArray.forEach(grade => {
  //      percentageOfTotalArray.push(grade/sumOfUnlockedGrades);
  //    });
  //
  //
  //    return newGrades;
  //  }

  //Generates Average from Past Grades 
  courseGrade(grades: any) {
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < grades.length; i++) {
      weightedSum += grades[i].grade * grades[i].weight;
      totalWeight += grades[i].weight;
    }
    return weightedSum / totalWeight;
  }

  //Generates Expected Grade by Averaging Both Past and Future Grades
  courseExpectedGrade(grades: any, futuregrades: any) {
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < grades.length; i++) {
      weightedSum += grades[i].grade * grades[i].weight;
      totalWeight += grades[i].weight;
    }

    for (let i = 0; i < futuregrades.length; i++) {
      weightedSum += futuregrades[i].grade * futuregrades[i].weight;
      totalWeight += futuregrades[i].weight;
    }
    return weightedSum / totalWeight;
  }

  //Creates New Evenly Distributed Grade to Equal the Goal Average to Equal Goal GPA
  disributeCourseGrades(grades: any, futuregrades: any, changedGrade) {
    let newGradesArray = [];
    let lockedGradeArray = [];
    let unlockedFutureGradeArray = [];
    let lockedGradeNum = grades.length;
    let unlockedGradeNum = 0;
    let courseExpectedGpa = this.user.currentGPA;
    let courseExpectedGrade = courseExpectedGpa * 25;
    let unlockedWeightedSum = 0;
    let totalWeightedSum = 0;
    let gradeNum = 0;

    grades.forEach(grade => {
      lockedGradeArray.push(grade);
    });

    //Seperate Grades (Locked/Unlocked)
    gradeNum = 0;
    futuregrades.forEach(grade => {
      if(grade.locked == false && gradeNum != changedGrade){
        unlockedFutureGradeArray.push(grade);
        unlockedWeightedSum += grade.weight;
        totalWeightedSum += grade.weight;
        unlockedGradeNum++;
      }
      else{
        lockedGradeArray.push(grade);
        lockedGradeNum++;
      }
      gradeNum++;
    });

    //Formula to distribute Grades
    //Here is an example of the formula
    // ((80*.7) + (80*.3) + (70*.7) + (x*4.3) / 6 = 85
    //80,80,70 are the previous/locked grades with their respective weights
    //x is the evenly distributed grade (what we want), while 4.3 is the total unlocked weighted sum
    //6 is the total weight sum
    //85 is the course grade we want to achieve


    //First Get Locked & History Grade Sum
    let lockedGradeSum = 0;
    lockedGradeArray.forEach(grade => {
      lockedGradeSum += (grade.grade * grade.weight);
      totalWeightedSum += grade.weight;
    });

    //Multiply Expected Course Grade with Total Weighted Sum
    let newDistributedGrade = (courseExpectedGrade * (totalWeightedSum));

    //Subtract Locked/Previous Grade Sum to The Formula
    newDistributedGrade = newDistributedGrade - lockedGradeSum;

    //Divide Weighted Sum of Unlocked Grades by The Formula
    newDistributedGrade = newDistributedGrade / unlockedWeightedSum;


    newDistributedGrade = Number(newDistributedGrade.toFixed(0));

    gradeNum = 0;
    futuregrades.forEach(grade => {
      if(grade.locked == false && gradeNum != changedGrade){
        grade.grade = newDistributedGrade
      }
      newGradesArray.push(grade);
      gradeNum++;
    });

    //console.log(newGradesArray);
    return newGradesArray;
  }

  
}