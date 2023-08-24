import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input()
  sidenavWidth!:number;
  constructor(public auth: AuthService){

  }
  ngOnInit(): void {
  }

}
