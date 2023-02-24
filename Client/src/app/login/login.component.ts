import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ResetPassDialogComponent } from './reset-pass-dialog/reset-pass-dialog.component';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  //theres a minLength validator among many others
  reset_password: boolean = false;

  constructor(public dialog: MatDialog) { }

  submit(){
    //console.log("user name is " + this.username)
    if(!this.username.hasError('email') 
    && !this.username.hasError('required')
    && !this.password.hasError('required')){
      //backend checks necessary for SQL injection
      //check if email and password match
      //valid login, reroute to proper page
      alert('succes')
    }else{
      
      alert('syntax error still present')
    }
    //then must reroute to appropriate dashboard based on student/staff
    this.clear();
  }

  validate_user_syntax(){
    if (this.username.hasError('required')) {
      //empty field
      return 'SHSU email required';
    } else if(this.username.hasError('email')){
      //invalid email syntax
      return 'Not a valid email';
    } else{
      //no syntax error detected
      return '';
    }
  }


  validate_password_syntax(){
    if(this.password.hasError('required')){
      return 'Password required';
    } else {
      return '';
    }
  }

  clear(){
    //clears username and password fields
    this.username //how to clear?
    this.password
    //this.valid_login = false;
  }

  re_set_password(){
    this.reset_password = true;
    const dialogRef = this.dialog.open(ResetPassDialogComponent, {
      width: '400px'});
    //used for setting password for new users, or resetting if forgotten
    //must make use of email notifs here
  }

  ngOnInit(): void {
  }

}
