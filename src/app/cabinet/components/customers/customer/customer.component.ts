import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { FirebaseService } from 'src/app/firebase.service';
import { Customer, CustomerData } from 'src/app/models/customer';
import { User } from 'src/app/models/user';
import { LoaderService } from 'src/app/services/loader.service';
import { UiService } from 'src/app/shared/services/UiService';
import { DeleteComponent } from '../../dialogs/delete/delete.component';



@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements AfterViewInit {
  @ViewChild('TABLE') table: ElementRef | undefined;

  displayedColumns: string[] = ['name', 'phone', 'createdBy','createDate','actions'];
  dataSource = new MatTableDataSource<CustomerData>()
  items: any = [];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(public loaderService: LoaderService ,private ui : UiService, public router: Router, public dialogRef:MatDialog,  private firebaseService: FirebaseService,private cService:CabinetService,public auth:AuthService) {
    //auth.getUser()
    this.getCustomers()
  }
  ngOnInit() {
  }
  goToedit(id:string){
    this.router.navigate(['/new-customer/'+ id]);
  }
  goToDetail(id:string){
    this.router.navigate(['/customer-detail/'+ id]);
  }
  getCustomers() {
    this.ui.spin$.next(true);
    var curentUserName = this.auth.getusername()
    var isAdmin = this.auth.isAdmin()

    this.items = []
    this.firebaseService.getDataList("customers2",curentUserName,isAdmin)
    .subscribe(result => {
      this.items = []
      result.map(x => {
        this.items.push({ id: x.payload.doc.id, data: x.payload.doc.data() })
      })
      this.dataSource.data = this.items
      this.ui.spin$.next(false);
    }, err => {
      console.error(err)
      this.ui.spin$.next(false);
    }) 
 
      
  }
  openDeleteDialog( id:string){
    var label = ''
    var ref = this.dialogRef.open(DeleteComponent,{
      position: {
        top: '150px',
      },
      data:{label: `${label}`, id: id}
    });
    ref.afterClosed().subscribe(result => {
      if(result){
        this.firebaseService.deleteCustomer(id)
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  export(){
    this.cService.export(this.table?.nativeElement,'Müştərilər');
  }
  applyFilter(event: any,key:any) {
     const filteredValues = { name:'', phone:'', gender:'' };
      var filterValue = ""
      if(key !== 'gender') filterValue = (event.target as HTMLInputElement).value;
      if(key === 'name') filteredValues['name'] = filterValue;
      if(key === 'phone') filteredValues['phone'] = filterValue;
      if(key === 'gender') filteredValues['gender'] = event.toString();

      this.dataSource.filter = JSON.stringify(filteredValues);
      this.dataSource.filterPredicate = this.customFilterPredicate();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  customFilterPredicate() {
    const myFilterPredicate = function(data:CustomerData, filter:string) :boolean {
      let searchString = JSON.parse(filter);
      let nameFound = data.data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
      let snameFound = data.data.surname.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
      let positionFound =( '+994'+ data.data.phone.toString().trim()).indexOf(searchString.phone) !== -1
      let weightFound = data.data.gender.toString().trim().indexOf(searchString.gender) !== -1
      if (searchString.topFilter) {
          return nameFound || snameFound || positionFound || weightFound
      } else {
          return (nameFound || snameFound )&& positionFound && weightFound
      }
    }
    return myFilterPredicate;
  }
}



