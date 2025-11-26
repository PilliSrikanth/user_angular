import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'https://hostel-backend-cfh3.onrender.com/api/users'; // <-- change to your backend

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(payload: { name:string; email:string; mobile?:string; password:string }) {
    return this.http.post(`${API_BASE}/register`, payload);
  }

  login(payload: { email:string; password:string }) {
    return this.http.post<{ token: string, _id?: string, email?: string, name?: string }>(`${API_BASE}/login`, payload);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  getToken(): string | null { return localStorage.getItem('token'); }
  logout() { localStorage.removeItem('token'); }
}
