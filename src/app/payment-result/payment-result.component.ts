import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css']
})
export class PaymentResultComponent {
  status:string = '';
  id:string = '';

  constructor(private route:ActivatedRoute, private router:Router){
    this.route.paramMap.subscribe(params=>{
      this.status = params.get('status') || '';
      this.id = params.get('id') || '';
    })
  }

  goBack(){
    this.router.navigate(['/home']);
  }
}