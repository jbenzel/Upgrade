import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentGPA = 3.5;
  estimatedGPA = 3.5;
  userID = 1;
  courseID = 1;


  constructor() { }
}
