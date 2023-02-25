import { Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reset-pass-dialog',
  templateUrl: './reset-pass-dialog.component.html',
  styleUrls: ['./reset-pass-dialog.component.scss']
})
export class ResetPassDialogComponent implements OnInit {

  username = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    public dialogRef: MatDialogRef<ResetPassDialogComponent>
  ) {}

  send_email(){
    if(this.username.valid){
      //there needs to be a boolean value in the backend so that
      //next time user logs in, they are prompted to create a new password
      this.dialogRef.close();
      alert('Email sent to '+this.username.value)
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}

