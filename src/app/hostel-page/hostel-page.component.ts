import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HostelService } from '../hostel.service';
import { HostelPageService } from '../hostel-page.service';
import { PaymentService } from '../payment.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-hostel-page',
  templateUrl: './hostel-page.component.html',
  styleUrls: ['./hostel-page.component.css']
})
export class HostelPageComponent implements OnInit {
  selectedSharing: string = '';
  hostel: any;
  ratings: any[] = [];
  mainImage: string = '';
  userId: string = localStorage.getItem('userId') || '';
  reviewText: string = '';
  reviewRating: number = 5;

  // PayU form HTML
  formHtml: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private hostelService: HostelService,
    private hostelpage: HostelPageService,
    private payService: PaymentService, 
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadHostel(id);
    this.loadReviews(id);
  }

  // Load hostel details
  loadHostel(id: string | null): void {
    if (!id) return;
    this.hostelService.getHostelById(id).subscribe((res: any) => {
      this.hostel = res.data || res;
      this.mainImage = this.hostel.images?.[0] || '';
    });
  }

  // Load hostel reviews
  loadReviews(hostelId: string | null): void {
    if (!hostelId) return;
    this.hostelpage.getHostelReviews(hostelId).subscribe((res: any) => {
      this.ratings = res.data || [];
    });
  }

  selectSharing(type: string): void {
    this.selectedSharing = type;
  }

  sendRequest(): void {
    if (!this.selectedSharing) {
      alert('Please select a sharing type!');
      return;
    }

    const requestData = {
      ownerId: this.hostel.ownerId,
      userId: this.userId,
      hostelId: this.hostel._id,
      senderType: 'user',
      sharingType: this.selectedSharing
    };

    this.hostelpage.sendRequest(requestData).subscribe(
      () => alert('Request sent successfully!'),
      (err) => {
        console.error(err);
        alert('You already joined another hostel');
      }
    );
  }

  // Submit a review
  submitReview(): void {
    if (!this.reviewText || !this.reviewRating) {
      alert('Please provide a rating and comment!');
      return;
    }

    const reviewData = {
      hostelId: this.hostel._id,
      userId: this.userId,
      rating: this.reviewRating,
      comment: this.reviewText
    };

    this.hostelpage.addReview(reviewData).subscribe(
      () => {
        alert('Review submitted successfully!');
        this.reviewText = '';
        this.reviewRating = 5;
        this.loadReviews(this.hostel._id);
      },
      (err) => {
        console.error(err);
        alert('Failed to submit review');
      }
    );
  }

  // inside HostelPageComponent
getSelectedSharingPrice(): number {
  return this.hostel?.roomSharing?.[this.selectedSharing] || 0;
}



BuyNowHandler(product?: any): void {
  if (!this.hostel || !this.userId) return;

const amount = this.getSelectedSharingPrice();
console.log("💰 Selected Sharing Price:", amount);


  const body = {
    userId: this.userId,
    hostelId: this.hostel._id,
    ownerId: this.hostel.ownerId,
    amount,
    product: product || `Hostel Fee - ${this.hostel.name} (${this.selectedSharing})`,
    firstname: 'Krishna', // ideally actual user name
    email: `user${Math.floor(Math.random() * 1000)}@mail.com`,
    mobile: `85${Math.floor(Math.random() * 100000)}485`
  };

  this.payService.getPayment(body).subscribe((data: any) => {
    this.formHtml = this.sanitizer.bypassSecurityTrustHtml(data);

    setTimeout(() => {
      const form: any = document.getElementById('payment_post');
      if (form) form.submit();
    }, 150);
  });
}

}
