import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private url = "no url"; // https://mailthis.to/
  private message = "Email testing lol"
  //must redo email service if its gonna be used.
  //must somehow use this module to trigger backend
  constructor(private http: HttpClient){}

  SendEmail() {
    this.url;
    return this.http.post(this.url, this.message);
  }

  getURL(){
    return this.url;
  }

  getMessage(){
    return this.message;
  }

}