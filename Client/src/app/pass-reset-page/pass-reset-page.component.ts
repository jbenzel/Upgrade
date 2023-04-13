import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {
  hasNumberValidator, 
  hasLowercaseValidator, 
  hasUppercaseValidator } from 'app/custom-validators';


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

  constructor() { }

  submit(){
    if(this.password.value !== this.conf_password.value){
      this.notMatching = true
    }else if(this.conf_password.valid && this.password.valid 
      && this.token.valid &&this.username.valid){

      this.notMatching = false
      this.syntax_error = false
      //call setNewPassword to check token is valid, if so destroy it


      //route to dashboard
      alert('success')
    }else{
      this.syntax_error = true
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
