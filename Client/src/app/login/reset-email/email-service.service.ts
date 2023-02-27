import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private url = "";
  constructor(private http: HttpClient){}

  SendEmail(input: any) {
    return this.http.post(this.url, input);
  }

}