import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    Text: string,
    obj_message: any,
    isRefresh: boolean
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent{

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialog: MatDialog) {
  }

  getData(data: any){
     return data.split('&');
  }

  reload(){
      window.location.reload();
  }
  
  isRefresh(value: boolean)
  {
      if(value)
      {
          window.location.reload();
      }
  }
}