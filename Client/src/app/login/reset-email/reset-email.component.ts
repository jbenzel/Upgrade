import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { EmailServiceService } from './email-service.service';


@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.scss']
})
export class ResetEmailComponent implements OnInit {
  FormData: FormGroup;
  constructor(private builder: FormBuilder, private contact: EmailServiceService) { }

  onSubmit(FormData){
    this.contact.SendEmail()
      .subscribe(response => {
        location.href = 'https://mailthis.to/confirm'
      }, error => {
      console.warn(error.responseText)
      //console.log({ error })
    })
  }

  ngOnInit(): void {
    this.FormData = this.builder.group({
      EmailAddress: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
      Body: "bruh"
    })
  }

}
