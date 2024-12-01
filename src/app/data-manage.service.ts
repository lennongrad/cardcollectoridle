import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManageService {

  constructor(private http: HttpClient) {

    this.http.get('assets/test.csv', {responseType: 'text'})
    .subscribe(
        data => {
            console.log(data);
        },
        error => {
            console.log(error);
        }
    );
    

  }
}
