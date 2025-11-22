import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email:any;
  password:any;

  constructor(private LoginService:LoginService, private router:Router){}

  loginUser(){
    const body = {
      email: this.email,
      password: this.password
    }

    this.LoginService.login(body).subscribe(
      (res:any)=>{
        console.log("LOGIN SUCCESS",res);
        this.router.navigate(['/home'])
            localStorage.setItem('userId', res._id);       // <-- THIS is the user ID
    localStorage.setItem('userName', res.name);
    localStorage.setItem('userEmail', res.email);
    localStorage.setItem('token', res.token);
        alert("LOGIN SUCCESS");
      },
      (err)=>{
        console.log("LOGIN FAILED",err);
        alert("LOGIN FAILED");
      }
    )
  }
}