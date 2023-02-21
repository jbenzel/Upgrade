import { Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reset-pass-dialog',
  templateUrl: './reset-pass-dialog.component.html',
  styleUrls: ['./reset-pass-dialog.component.scss']
})
export class ResetPassDialogComponent implements OnInit {

  username : string = "";

  constructor(
    public dialogRef: MatDialogRef<ResetPassDialogComponent>
  ) {}

  send_email(){
    //there needs to be a boolean value in the backend so that
    //next time user logs in, they are prompted to create a new password
  }

  ngOnInit(): void {
  }

}

