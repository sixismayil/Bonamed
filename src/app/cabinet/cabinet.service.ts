import { Injectable } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet.component';
import * as XLSX from 'xlsx';
import { AuthService } from '../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from './components/dialogs/message-dialog/message-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CabinetService {
  messageDialog(arg0: string, arg1: boolean) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private auth:AuthService,    
    private dialog: MatDialog
    ) { }
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: CabinetComponent,
      children: routes,
      data: { reuse: true },
    };
  }



  export(data:any,exportName:string)
  {
   // this.exportActive = true;
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    var wscols = [
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20}
  ];
  
  ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */
    XLSX.writeFile(wb, exportName +'.xlsx');
    
  }
  fitToColumn(arrayOfArray:any) {
    // get maximum character of each column
    return arrayOfArray.map((a: any, i: string | number) => ({ wch: Math.max(...arrayOfArray.map((a2: { [x: string]: { toString: () => { (): any; new(): any; length: any; }; }; }) => a2[i] ? a2[i].toString().length : 0)) }));
}
}
