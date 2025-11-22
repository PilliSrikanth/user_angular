import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  ownerId: string = '';
  userId: string = localStorage.getItem('userId') || '';
  hostelId:string= ''
  ownerName: string = '';
  messageText: string = '';
  messages: any[] = [];
  selectedRequest: any;
  message = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private location: Location,
    private requestService: RequestService
  ) {
this.ownerId = this.route.snapshot.paramMap.get('ownerId') || '';
this.hostelId = this.route.snapshot.paramMap.get('hostelId') || '';

  }

  ngOnInit(): void {
    this.loadMessages();
        this.selectedRequest = history.state.request;
    console.log('Request info ->', this.selectedRequest);
  }

  loadMessages() {
    this.chatService.getMessages(this.userId, this.ownerId, this.hostelId).subscribe((res: any) => {
      this.messages = res.messages;
      this.ownerName = res.hostel.name; 

      // auto scroll
      setTimeout(() => {
        const body = document.querySelector('.chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      }, 50);
    });
  }

  send() {
    if (!this.messageText.trim()) return;

const data = {
  ownerId: this.ownerId,
  userId: this.userId,
  hostelId: this.hostelId,
  message: this.messageText,
  senderType: 'user'
};


    this.chatService.sendMessage(data).subscribe(() => {
      this.messageText = '';
      this.loadMessages();
    });
  }

    goBack() {
    this.location.back();
  }


    onAccept() {
    this.requestService.updateStatus(this.selectedRequest._id, 'accepted').subscribe({
      next: () => {
        this.message = '✅ Request accepted';
        this.selectedRequest.status = 'accepted';
      }
    });
  }

  onDecline() {
    this.requestService.updateStatus(this.selectedRequest._id, 'declined').subscribe({
      next: () => {
        this.message = '🚫 Request declined';
        this.selectedRequest.status = 'declined';
      }
    });
  }

}
