import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-reset-email',
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.scss']
})
export class ResetEmailComponent implements OnInit {
  FormData: FormGroup;
  constructor(private builder: FormBuilder) { }

  onSubmit(FormData){

  }

  ngOnInit(): void {
    this.FormData = this.builder.group({
      EmailAddress: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
      Body: new FormControl('', [Validators.required])
    })
  }

}
