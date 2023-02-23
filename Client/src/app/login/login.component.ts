import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ResetPassDialogComponent } from './reset-pass-dialog/reset-pass-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username : string = "";
  password : string = "";
  valid_user_syntax: boolean = false;
  valid_login : boolean = false;
  reset_password: boolean = false;

  constructor(public dialog: MatDialog) { }

  submit(){
    //console.log("user name is " + this.username)
    if(this.validate_user() && this.validate_password()){
      //backend checks necessary for SQL injection
      //valid login, reroute to proper page
      this.valid_login = true;
      alert("valid")
    }else{
      //output error (might be only in html)
    }
    //then must reroute to appropriate dashboard based on student/staff
    this.clear();
  }

  validate_user(): boolean{
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.username == "") {
      alert("Email must be filled out");
      
      return false;
    } else if (email_regex.test(this.username.toLowerCase()) == false) {
      alert("Email must be valid");
    
      return false;
    }
  
    return true;
  }

  validate_password(): boolean{

    return true;
  }

  clear(){
    //clears username and password fields
    this.username ="";
    this.password = "";
    this.valid_login = false;
    this.valid_user_syntax = false;
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
