import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrgencyService {

  constructor() { }

  // start urgency function
  urgency(estimatedGpa: number, currGpa: number, courseHour: number, semesterHours: number, gradeWeight: number, itemsSameWeight: number, totalCompletedHours: number, timeRemaining: number): number {
    const gpaDifference = estimatedGpa - currGpa;
    const courseEffect = (courseHour / semesterHours) / 2;
    const singleItemWeight = (gradeWeight / itemsSameWeight) / 2;
    const percentOnGpa = (gpaDifference + singleItemWeight * courseEffect) / (totalCompletedHours * 2 + semesterHours);

    if (timeRemaining < 15 && timeRemaining > 0) {
      const functionVal = (4000 * percentOnGpa) / (5 * (timeRemaining / 14));
      // console.log(`days left: ${timeRemaining}`);
      return Math.log(functionVal) / Math.log(3);
    }
    return 0;
  }
  // end urgency function
  
}
