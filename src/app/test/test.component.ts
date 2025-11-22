import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  formHtml: SafeHtml = '';

  products = [
    {
      id:1,
      title:'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
      price:109.95,
      description:'Your perfect pack for everyday use...',
      category:"men's clothing",
      image:'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
    },
    {
      id:2,
      title:'Mens Casual Premium Slim Fit T-Shirts ',
      price:22.3,
      description:'Slim-fitting style...',
      category:"men's clothing",
      image:'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
    },
    {
      id:3,
      title:'Mens Cotton Jacket',
      price:55.99,
      description:'great outerwear jackets...',
      category:"men's clothing",
      image:'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
    }
  ]

  constructor(private payService:PaymentService, private sanitizer:DomSanitizer){}

  BuyNowHandler(amount:number, product:any){
    const body = {
      amount,
      product,
      firstname:'Krishna',
      email:`harish${Math.floor(Math.random()*56)}@gmail.com`,
      mobile:`85${Math.floor(Math.random()*56000)}485`
    }

    this.payService.getPayment(body).subscribe((data)=>{
      this.formHtml = this.sanitizer.bypassSecurityTrustHtml(data);

      setTimeout(()=>{
        const form:any = document.getElementById("payment_post");
        if(form){ form.submit(); }
      },150)
    })
  }
}