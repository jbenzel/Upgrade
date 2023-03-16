import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {passMatchValidator, 
  hasNumberValidator, 
  hasLowercaseValidator, 
  hasUppercaseValidator } from 'app/custom-validators';


@Component({
  selector: 'app-pass-reset-page',
  templateUrl: './pass-reset-page.component.html',
  styleUrls: ['./pass-reset-page.component.scss']
})
export class PassResetPageComponent implements OnInit {
  password = new FormControl('', [
    Validators.required, 
    Validators.minLength(8), 
    hasNumberValidator(),
    hasLowercaseValidator(),
    hasUppercaseValidator()
  ]);

  conf_password = new FormControl('', [
    Validators.required,
    passMatchValidator()
  ]);

  constructor() { }

  submit(){

    if(this.conf_password.valid && this.password.valid &&
      this.password.value == this.conf_password.value){

      alert('success')
    }else{
      
      alert('syntax error still present or passwords do not match')
    }
    //then must reroute to login page
    this.clear()
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
      return 'Password required';
    } else if(this.conf_password){
      return 'Passwords must Match';
    }else {
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
