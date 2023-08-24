import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CabinetComponent {
  sidenavWidth = 15;
  testWidth = "margin-left:" + this.sidenavWidth + "%!important";

  public getScreenWidth: any;
  public getScreenHeight: any;

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if (this.getScreenWidth <= 991) {
      this.testWidth = "margin-left:0%!important";
    } else {
      this.sidenavWidth = 15;
      this.testWidth = "margin-left:" + this.sidenavWidth + "%!important";
    }
  }

  @HostListener('window:resize', ['$event'])

  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    if (this.getScreenWidth <= 991) {
      this.testWidth = "margin-left:0%!important";
    } else {
      this.sidenavWidth = 15;
      this.testWidth = "margin-left:" + this.sidenavWidth + "%!important";
    }

  }

  sideToggle() {
    if (this.sidenavWidth == 4) {
      this.sidenavWidth = 15;
    } else {
      this.sidenavWidth = 4;
    }
    this.testWidth = "margin-left:" + this.sidenavWidth + "%!important";
  }


}
