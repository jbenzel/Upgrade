import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ResetPassDialogComponent } from './reset-pass-dialog/reset-pass-dialog.component';
import {FormControl, Validators} from '@angular/forms';
import {
  hasNumberValidator, 
  hasLowercaseValidator, 
  hasUppercaseValidator } from 'app/custom-validators';
import { Apollo, gql, QueryRef } from 'apollo-angular';

//user info has to be sent to the server for authentication
//otherwise, valid authentication cannot occur
//something like send user creds and return true or false for authorization
const VALIDATE_USER = gql`
query ValidateUser($emailParam: String, $passwordParam: String) {
  validateUser(emailParam: $emailParam, passwordParam: $passwordParam) {
    email
  }
}
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  getAllSOVQuery!: QueryRef<any>;
  username = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required, 
    Validators.minLength(8),
    hasNumberValidator(),
    hasLowercaseValidator(),
    hasUppercaseValidator()
  ]);

  reset_password: boolean = false;
  constructor(public dialog: MatDialog, private apollo: Apollo) { }

  submit(){
    if(this.username.valid && this.password.valid){
      //check if email and password match. MUST FIGURE OUT HOW TO PROPERLY VALIDATE USER WITHOUT EXPOSING SECRETS
      this.apollo.watchQuery<any>({
        query: VALIDATE_USER
      }).valueChanges
        .subscribe(({ data }) => {
          console.log(data);
        });
  
      this.getAllSOVQuery.refetch();

      //valid login, reroute to proper page
      alert('succes')
    }else{
      
      alert('syntax error still present')
    }
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
    } else if(this.password.hasError('minlength')){
      return 'Must be least 8 characters';
    } else if(this.password.hasError('hasNumeric')){
      return 'Must contain a number'
    } else if(this.password.hasError('hasLowercase')){
      return 'Must contain one lowercase'
    }else if(this.password.hasError('hasUppercase')){
      return 'Must contain one uppercase'
    }else {
      return '';
    }
  }

  clear(){
    //clears username and password fields
    this.username.reset() //how to clear?
    this.password.reset()
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
