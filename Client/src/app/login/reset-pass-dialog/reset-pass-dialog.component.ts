import { Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { EmailServiceService } from '../reset-email/email-service.service';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql, QueryRef } from 'apollo-angular';

const VALIDATE_EMAIL = gql`
query ($emailParam: String) {
  getUserbyEmail(emailParam: $emailParam) {
    email
  }
}
`;

export interface DialogData {
  email: string;
}

@Component({
  selector: 'app-reset-pass-dialog',
  templateUrl: './reset-pass-dialog.component.html',
  styleUrls: ['./reset-pass-dialog.component.scss']
})
export class ResetPassDialogComponent implements OnInit {
  getAllSOVQuery!: QueryRef<any>;
  username = new FormControl('', [Validators.required, Validators.email]);
  must_be_valid: boolean = false;
  user_not_found: boolean = false;
  email_sent: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ResetPassDialogComponent>,
    private EmailService: EmailServiceService,
    private http: HttpClient,
    private apollo: Apollo
  ) {}

  send_email(){
    if(this.username.valid){
      //once username has been matched in backend
      this.apollo.watchQuery<any>({
        query: VALIDATE_EMAIL,
        variables: {
          "emailParam": this.username.value
        }
      }).valueChanges.subscribe(({ data }) => {
          console.log(data);
          if(data.getUserbyEmail != null){
            //email matched, send email
            alert('succes')
            this.must_be_valid = false

            var url = this.EmailService.getURL() + this.username.value;
            var message = this.EmailService.getMessage();
            this.http.post(url, message).subscribe(
              res => {
                console.log(res);
              }
            );

            this.dialogRef.close();
            alert('Email sent to '+this.username.value)
            this.email_sent = true
            this.must_be_valid = false


          }else{
            //invalid email, alert user
            this.must_be_valid = true
          }
      });
      //this.getAllSOVQuery.refetch();

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

