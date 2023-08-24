import { Component } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { AuthService } from './auth.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bonamed';
  items: any = []; 

  // deleted 
  constructor(private firebaseService: FirebaseService,private authService: AuthService) { }

  ngOnInit(): void {
  }
}
