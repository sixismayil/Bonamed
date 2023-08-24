import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/firebase.service';
import { UiService } from 'src/app/shared/services/UiService';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  id = this.r.snapshot.params.id
  customer:any
  constructor(private ui : UiService,private firebaseService: FirebaseService,private r: ActivatedRoute) {
    this.getCustomerDetail()
   }

  ngOnInit(): void {
  }
  getCustomerDetail(){
    this.ui.spin$.next(true);
     this.firebaseService.getDataById('customers',this.id).subscribe(x=>{
      this.customer = JSON.parse(JSON.stringify(x.data()));
      this.ui.spin$.next(false);
     })
  }
}
