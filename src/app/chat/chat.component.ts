import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  ownerId: string = '';
  userId: string = localStorage.getItem('userId') || '';
  hostelId: string = '';
  ownerName: string = '';
  messageText: string = '';
  messages: any[] = [];
  selectedRequest: any;

  // socket listener
  messageSub!: any;

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
    this.selectedRequest = history.state.request;
    this.loadMessages();
    this.listenRealTimeMessages();
  }

  ngOnDestroy(): void {
    if (this.messageSub) this.messageSub.unsubscribe();
  }

  // ⬇ Load existing chat history
  loadMessages() {
    this.chatService.getMessages(this.userId, this.ownerId, this.hostelId).subscribe((res: any) => {
      this.messages = res.messages;
      this.ownerName = res.hostel.name;

      this.scrollToBottom();
    });
  }

  // ⬇ Real-time socket listener
  listenRealTimeMessages() {
    this.messageSub = this.chatService.listenForMessages().subscribe((msg: any) => {

      // Only add messages for this specific chat
      if (
        msg.userId === this.userId &&
        msg.ownerId === this.ownerId &&
        msg.hostelId === this.hostelId
      ) {
        this.messages.push(msg);
        this.scrollToBottom();
      }

    });
  }

  // ⬇ Send message without refresh
  send() {
    if (!this.messageText.trim()) return;

    const data = {
      ownerId: this.ownerId,
      userId: this.userId,
      hostelId: this.hostelId,
      message: this.messageText,
      senderType: 'user'
    };

    this.chatService.sendMessage(data).subscribe((res: any) => {
      // Immediately show message in UI (no reload needed)
      this.messages.push(res);
      this.messageText = '';
      this.scrollToBottom();
    });
  }

  // ⬇ Scroll chat to bottom
  scrollToBottom() {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-body');
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
    }, 50);
  }

  // ⬇ Back button
  goBack() {
    this.location.back();
  }

  // ⬇ Accept request
  onAccept() {
    this.requestService.updateStatus(this.selectedRequest._id, 'accepted').subscribe({
      next: () => {
        this.selectedRequest.status = 'accepted';
      }
    });
  }

  // ⬇ Decline request
  onDecline() {
    this.requestService.updateStatus(this.selectedRequest._id, 'declined').subscribe({
      next: () => {
        this.selectedRequest.status = 'declined';
      }
    });
  }

}
