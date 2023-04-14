import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {
  hasNumberValidator, 
  hasLowercaseValidator, 
  hasUppercaseValidator } from 'app/custom-validators';
import { Apollo, gql, QueryRef } from 'apollo-angular';


const RESET_PROCEDURE = gql`
query ($emailParam: String, $password: String, $content: String) {
  setNewPassword(emailParam: $emailParam, password: $password, content: $content) {
    email
  }
}
`;


@Component({
  selector: 'app-pass-reset-page',
  templateUrl: './pass-reset-page.component.html',
  styleUrls: ['./pass-reset-page.component.scss']
})
export class PassResetPageComponent implements OnInit {

  username = new FormControl('', [Validators.required, Validators.email]);

  token = new FormControl('', [
    Validators.required,
  ]);

  password = new FormControl('', [
    Validators.required, 
    Validators.minLength(8), 
    hasNumberValidator(),
    hasLowercaseValidator(),
    hasUppercaseValidator()
  ]);

  conf_password = new FormControl('', [
    Validators.required,
  ]);

  notMatching = false
  syntax_error = false
  invalid_creds = false

  constructor(private apollo: Apollo) { }

  submit(){
    if(this.password.value !== this.conf_password.value){

      this.notMatching = true
      this.syntax_error = false
      this.invalid_creds = false

    }else if(this.conf_password.valid && this.password.valid 
      && this.token.valid &&this.username.valid){

      //reset all conditionals
      this.notMatching = false
      this.syntax_error = false
      this.invalid_creds = false
      //call setNewPassword to check token is valid, if so destroy it
      this.apollo.watchQuery<any>({
        query: RESET_PROCEDURE,
        variables: {
          "emailParam": this.username.value,
          "password": this.conf_password.value,
          "content": this.token.value
        }
      }).valueChanges.subscribe((reset_response) => {
        //return User if success
        console.log(reset_response.data)
        if(reset_response.data.setNewPassword != null){
          //route to dashboard
          alert("success")

        }else{
          //else fail
          this.invalid_creds = true
        }
      })


    }else{
      this.syntax_error = true
      this.invalid_creds = false
      this.notMatching = false
    }
    //then must reroute to login page
    this.clear()
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

  validate_conf_password_syntax(){
    if(this.conf_password.hasError('required')){
      return 'Must confirm password';
    } else {
      return '';
    }
  }

  token_required(){
    if(this.token.hasError('required')){
      return 'Token required';
    } else {
      return '';
    }
  }

  clear(){
    //clears password fields
    this.conf_password.reset()
    this.password.reset()
  }

  ngOnInit(): void {
  }

}
