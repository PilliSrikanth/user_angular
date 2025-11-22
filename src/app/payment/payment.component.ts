import { Component, OnInit } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  tab: string = 'all';
  userId = '';
  months: any[] = [];
  formHtml: SafeHtml = '';
  hostel: any = null;
  user: any = null;
  selectedSharing: string = '';

  constructor(
    private paymentService: PaymentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // ✅ Get userId from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.userId = parsedUser._id;
      this.user = parsedUser; // Save full user object
    } else {
      this.userId = localStorage.getItem('userId') || '';
    }

    if (!this.userId) {
      console.error('❌ No logged-in user found.');
      return;
    }

    // ✅ Load transactions after userId is available
    this.loadUserTransactions();
  }

  // 🧾 Load User + Hostel + Transactions
  loadUserTransactions() {
    this.paymentService.getUserDetails(this.userId).subscribe({
      next: (res) => {
        console.log('✅ User Data:', res);

        this.user = res.user;

        // ⚡ Fix: use 'joinedHostel' instead of 'hostelDetails'
        this.hostel = this.user.joinedHostel || null;

        this.selectedSharing = this.hostel?.sharingType || '';

        // Flatten transactions for monthly grouping
        const transactions = res.transactions.map((t: any) => ({
          name: t.hostelId?.name || t.hostel?.name || this.hostel?.hostelName || 'Unknown Hostel',
          amount: t.amount,
          time: new Date(t.createdAt).toLocaleString(),
          method: 'PayU',
          hostelId: t.hostelId?._id,
          status: t.status,
        }));

        // Group by month
        this.months = this.groupByMonth(transactions);
      },
      error: (err) => {
        console.error('❌ Error loading transactions:', err);
      }
    });
  }

  // 📆 Group transactions by month
  groupByMonth(transactions: any[]) {
    const groups: any = {};
    transactions.forEach(txn => {
      const month = new Date(txn.time).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(txn);
    });
    return Object.keys(groups).map(month => ({ month, transactions: groups[month] }));
  }

  // 💳 Show payment gateway icon
  getIcon(method: string) {
    return method === 'PayU' ? 'assets/payu-icon.png' : 'assets/default-icon.png';
  }

  // 💰 Get price for selected sharing
  getSelectedSharingPrice(): number {
    if (!this.hostel) return 0;
    return this.hostel.sharingPrice || 0;
  }

  // 🛒 Handle "Buy Now" action
  BuyNowHandler(product?: any): void {
    if (!this.hostel || !this.userId) {
      console.error('❌ Hostel or User not found.');
      return;
    }

    const amount = this.getSelectedSharingPrice();
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount.');
      return;
    }

    console.log('💰 Selected Sharing Price:', amount);

    const body = {
      userId: this.userId,
      hostelId: this.hostel.hostelId || this.hostel._id,
      ownerId: this.hostel.ownerId,
      amount,
      product: product || `Hostel Fee - ${this.hostel.hostelName} (${this.selectedSharing})`,
      firstname: this.user?.name || 'User',
      email: this.user?.email || `user${Math.floor(Math.random() * 1000)}@mail.com`,
      mobile: this.user?.mobile || `85${Math.floor(Math.random() * 100000)}485`,
    };

    this.paymentService.getPayment(body).subscribe({
      next: (data: any) => {
        console.log('✅ Payment Form HTML received:', data);
        this.formHtml = this.sanitizer.bypassSecurityTrustHtml(data);

        // Auto-submit form
        setTimeout(() => {
          const form = document.getElementById('payment_post') as HTMLFormElement;
          if (form) {
            console.log('🚀 Submitting PayU payment form...');
            form.submit();
          } else {
            console.error('❌ Payment form not found in DOM.');
          }
        }, 200);
      },
      error: (err) => {
        console.error('❌ Error initiating payment:', err);
      }
    });
  }
}
