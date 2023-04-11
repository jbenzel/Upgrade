import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ResetPassDialogComponent } from './reset-pass-dialog/reset-pass-dialog.component';
import {FormControl, Validators} from '@angular/forms';
import {
  hasNumberValidator, 
  hasLowercaseValidator, 
  hasUppercaseValidator } from 'app/custom-validators';
import { Apollo, gql, QueryRef } from 'apollo-angular';

//might have to encapsulate this to hide backend structure
const VALIDATE_USER = gql`
query ($emailParam: String, $passwordParam: String) {
  validateUser(emailParam: $emailParam, passwordParam: $passwordParam) {
    email
  }
}
`;

const CHECK_LOGIN = gql`
query ($emailParam: String) {
  getUserbyEmail(emailParam: $emailParam) {
    firstLogin
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
  invalid_creds: boolean = false;
  must_be_valid: boolean = false;
  reset_password: boolean = false;

  constructor(public dialog: MatDialog, private apollo: Apollo) { }


  submit(){


    if(this.username.valid && this.password.valid){
      //if valid syntax, check for valid creds in backend
      this.apollo.watchQuery<any>({
        query: CHECK_LOGIN,
        variables: {
          "emailParam": this.username.value,
        }
      }).valueChanges.subscribe(({ data }) => {

          console.log(data.getUserbyEmail.firstLogin)
          //check that not first login
          if(!data.getUserbyEmail.firstLogin){

            this.apollo.watchQuery<any>({
              query: VALIDATE_USER,
              variables: {
                "emailParam": this.username.value,
                "passwordParam": this.password.value
              }
            }).valueChanges.subscribe(({ data }) => {

              console.log(data.validateUser)
              //check that credentials are valid
              if(data.validateUser != null){
                //route to dashboard upon successful login
                alert('succes')
                this.must_be_valid = false
                this.invalid_creds = false

              }else{
                //invalid creds, alert user
                this.invalid_creds = true
                this.must_be_valid = false
              }

            });

          }else{
            //invalid creds, alert user
            this.invalid_creds = true
            this.must_be_valid = false
          }
      });


      //console.log(validated+" and "+firstLogin)

          

      //getAllSOVQuery.refetch gives me issues
      //this.getAllSOVQuery.refetch();
    }else{
      this.must_be_valid = true
      this.invalid_creds = false
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
