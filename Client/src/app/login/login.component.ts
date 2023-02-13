import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username : string = "";
  password : string = "";
  valid_login : boolean = false;

  constructor() { }

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
  }

  ngOnInit(): void {
  }

}
