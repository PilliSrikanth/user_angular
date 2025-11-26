import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  baseUrl = "https://hostel-backend-cfh3.onrender.com/api/chat";

  constructor(private http:HttpClient){}

  sendMessage(data:any){
    return this.http.post(`${this.baseUrl}/send`, data);
  }

  getMessages(userId:string, ownerId:string, hostelId:string){
    return this.http.get(`${this.baseUrl}/${userId}/${ownerId}/${hostelId}`);
  }
}
