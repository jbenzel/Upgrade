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
    //must add the check for user + password
    //then must reroute to appropriate dashboard based on student/staff
    this.clear();
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
      width: '370px'});
    //used for setting password for new users, or resetting if forgotten
    //must make use of email notifs here
  }

  ngOnInit(): void {
  }

}
