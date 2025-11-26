import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = "https://hostel-backend-cfh3.onrender.com/api/users/";

  constructor(private http: HttpClient) { }

  register(data:any):Observable<any>{
    return this.http.post(this.baseUrl + "register", data);
  }

    login(data:any){
    return this.http.post(this.baseUrl + "login", data);
  }
  
}