// services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'https://hostel-backend-cfh3.onrender.com/api/notification';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/read/${notificationId}`, {});
  }

  deleteNotification(notificationId: string) {
  return this.http.delete(`${this.apiUrl}/${notificationId}`);
}


}
