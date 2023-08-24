import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { FirebaseService } from 'src/app/firebase.service';
import { User, UserData } from 'src/app/models/user';
import { LoaderService } from 'src/app/services/loader.service';
import { DeleteComponent } from '../../dialogs/delete/delete.component';
import { UiService } from 'src/app/shared/services/UiService';



@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements AfterViewInit {
  public dialog!: MatDialog;
  @ViewChild('TABLE') table: ElementRef | undefined;

  displayedColumns: string[] = ['username', 'isAdmin', 'actions'];
  dataSource = new MatTableDataSource<UserData>()
  items: any = [];
  user!: User;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public loaderService: LoaderService ,private ui : UiService, public router: Router, private dialogRef: MatDialog, private auth: AuthService, private firebaseService: FirebaseService, private cService: CabinetService) {
    this.getUsers()
    this.dataSource = new MatTableDataSource(this.items);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getUsers() {
    this.ui.spin$.next(true);
    this.firebaseService.getDataUserList(this.auth.getusername())
      .subscribe((result: any[]) => {
        this.items = []
        result.map(x => {
          this.items.push({ id: x.payload.doc.id, data: x.payload.doc.data()})
        })
        this.items = this.items.filter((y: any) =>y.data.username != this.auth.getusername()) 
        this.dataSource.data = this.items;
        this.ui.spin$.next(false);

      }, (err: { log: (arg0: any) => void; }) => {
        console.log(err)
        this.auth.messageDialog("Sistemdə xəta baş verdi.",false)
        this.ui.spin$.next(false);
      })
  }
  deactive(id: string) {
    var label = ''
    var ref = this.dialogRef.open(DeleteComponent, {
      // width: '500px',
      position: {
        top: '150px',
      },
      data: { label: `${label}`, id: id }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.firebaseService.getDataById("users", id).subscribe(x => {
          this.auth.deActiveUser(id,x.data())
         
        })
      }
    });
  }
  goToEdit(id:string){
    this.router.navigate(['/new-employee/'+ id]);
  }
  // export and filter 
  export() {
    this.cService.export(this.table?.nativeElement, 'İşçilər');
  }
  applyFilter(event: any) {
    const filteredValues = { username: '' };
    filteredValues['username'] = (event.target as HTMLInputElement).value;;
    this.dataSource.filter = JSON.stringify(filteredValues);
    this.dataSource.filterPredicate = this.customFilterPredicate();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: UserData, filter: string): boolean {
      let searchString = JSON.parse(filter);
      return data.data.username.toString().trim().toLowerCase().indexOf(searchString.username.toLowerCase()) !== -1
    }
    return myFilterPredicate;
  }
 
}

