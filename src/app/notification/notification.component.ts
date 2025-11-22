import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../request.service';
import { Location } from '@angular/common';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  userId = localStorage.getItem('userId') || '';

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications(this.userId).subscribe({
      next: (res: any) => {
        this.notifications = res.notifications;
        console.log('Notifications:', this.notifications);
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  markNotificationRead(notificationId: string) {
  this.notificationService.markAsRead(notificationId).subscribe({
    next: () => {
      // Remove the notification from local list
      this.notifications = this.notifications.filter(n => n._id !== notificationId);
      console.log('✅ Notification removed after opening');
    },
    error: (err) => console.error('❌ Error marking notification as read', err)
  });
}


openNotification(notification: any) {
  switch (notification.type) {
    case 'request':
      this.router.navigate(['/notification-details', this.userId], {
        state: { request: notification.data }
      });
      break;

    case 'chat':
      // Navigate to chat
      this.router.navigate([
        '/chat',
        notification.data.ownerId,
        notification.data.hostelId
      ]).then(() => {
        // After navigation, remove or mark notification as read
        this.markNotificationRead(notification._id);
        this.deleteNotification(notification._id);
      });
      break;

    default:
      this.router.navigate(['/dashboard']);
      break;
  }
}

deleteNotification(notificationId: string) {
  this.notificationService.deleteNotification(notificationId).subscribe({
    next: () => {
      // Remove locally so UI updates immediately
      this.notifications = this.notifications.filter(n => n._id !== notificationId);
      console.log('✅ Notification automatically deleted after read');
    },
    error: (err) => console.error('❌ Error deleting notification', err)
  });
}

    goBack() {
    this.location.back();
  }

}