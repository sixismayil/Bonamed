import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CabinetService } from 'src/app/cabinet/cabinet.service';

export interface DialogData {
  label: string,
  id: any
}

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  data:any;
  label: string;
  id: any;

  constructor(@Inject(MAT_DIALOG_DATA)  data: DialogData, public cabinetService: CabinetService) {
    this.data = data;
    this.label = data.label;
    this.id = data.id;
  }


  ngOnInit(): void {
  }

}
