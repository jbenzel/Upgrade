import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reset-pass-dialog',
  templateUrl: './reset-pass-dialog.component.html',
  styleUrls: ['./reset-pass-dialog.component.scss']
})
export class ResetPassDialogComponent implements OnInit {
  email: string;

  constructor(public dialog: MatDialog) { }

  openPasswordDialog(): void {
    const dialogRef = this.dialog.open(ResetPassDialogComponent, {
      data: {email: this.email},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.email = result;
    });
  }

  ngOnInit(): void {
  }

}

