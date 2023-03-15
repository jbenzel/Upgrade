import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-pass-reset-page',
  templateUrl: './pass-reset-page.component.html',
  styleUrls: ['./pass-reset-page.component.scss']
})
export class PassResetPageComponent implements OnInit {
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  conf_password = new FormControl('', [Validators.required, Validators.minLength(8)]);

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
      return 'Password must be least 8 characters';
    } else {
      return '';
    }
  }

  validate_conf_password_syntax(){
    if(this.conf_password.hasError('required')){
      return 'Password required';
    } else if(this.password.hasError('minlength')){
      return 'Password must be least 8 characters';
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
