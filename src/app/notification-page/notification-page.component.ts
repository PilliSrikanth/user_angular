import { Component, OnInit } from '@angular/core';
import { RequestService } from '../request.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.css']
})
export class NotificationPageComponent implements OnInit {
  userId: string = '';
  requests: any[] = [];
  message = '';

  constructor(private requestService: RequestService, private location: Location) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    if (this.userId) {
      this.requestService.getUserRequests(this.userId).subscribe({
        next: (res: any) => {
          this.requests = res.data || [];
          console.log('User requests:', this.requests);
        },
        error: (err) => console.error('Error fetching requests', err)
      });
    }
  }

  onAccept(request: any) {
    this.requestService.updateStatus(request._id, 'accepted').subscribe({
      next: () => {
        request.status = 'accepted';
        this.message = '✅ Request accepted';
      }
    });
  }

  onDecline(request: any) {
    this.requestService.updateStatus(request._id, 'declined').subscribe({
      next: () => {
        request.status = 'declined';
        this.message = '🚫 Request declined';
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
