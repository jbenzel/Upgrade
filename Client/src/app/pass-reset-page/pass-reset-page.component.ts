import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {
  hasNumberValidator, 
  hasLowercaseValidator, 
  hasUppercaseValidator } from 'app/custom-validators';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { UserService } from 'app/services/user.service';
import { AESEncryptDecryptServiceService } from 'app/services/aesencrypt-decrypt-service.service';
import { Router } from '@angular/router';


const RESET_PROCEDURE = gql`
query Query($emailParam: String, $content: String, $password: String) {
  setNewPassword(emailParam: $emailParam, content: $content, password: $password) {
    email
    firstLogin
    firstName
    lastName
    password
    role
    userID
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

  constructor(
    private apollo: Apollo, 
    private user: UserService,
    private AES: AESEncryptDecryptServiceService,
    private router: Router
  ) { }

  submit(){
    //set all conditionals
    this.notMatching = false
    this.syntax_error = false
    this.invalid_creds = false

    if(this.password.value !== this.conf_password.value){
      //password and confirm password fields do not match
      this.notMatching = true
      this.syntax_error = false
      this.invalid_creds = false
      this.clear()

    }else if(this.conf_password.valid && this.password.valid 
      && this.token.valid &&this.username.valid){

      var encrypted_user = this.AES.encrypt(this.username.value)
      var encrypted_pass = this.AES.encrypt(this.conf_password.value)
      var encrypted_token = this.AES.encrypt(this.token.value)

      //call setNewPassword to check token is valid, if so destroy it
      this.apollo.watchQuery<any>({
        query: RESET_PROCEDURE,
        variables: {
          "emailParam": encrypted_user,
          "password": encrypted_pass,
          "content": encrypted_token
        }
      }).valueChanges.subscribe((reset_response) => {
        //return User if success
        if(reset_response.data.setNewPassword != null){
          //route to dashboard
          this.router.navigate(['/', 'student-dashboard']);
          this.user.userID = reset_response.data["setNewPassword"].userID;

        }else{
          //else fail
          this.invalid_creds = true
          
        }
        this.clear()
      })

    }else{
      this.syntax_error = true
      this.invalid_creds = false
      this.notMatching = false
      this.clear()
    }
    
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
    //clears all fields
    this.username.reset()
    this.token.reset()
    this.conf_password.reset()
    this.password.reset()
  }

  ngOnInit(): void {
  }

}
