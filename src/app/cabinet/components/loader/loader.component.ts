import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(public loaderService: LoaderService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }
}
