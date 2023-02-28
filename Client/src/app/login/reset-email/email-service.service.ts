import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {
  private url = "https://mailthis.to/"; // https://mailthis.to/
  private message = "Email testing lol"
  //replace upGrade-reset with any email based on user input
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