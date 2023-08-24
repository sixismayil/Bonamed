import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CabinetComponent } from './cabinet.component';
import { SidebarComponent } from './fixed-part/sidebar/sidebar.component';
import { HeaderComponent } from './fixed-part/header/header.component';
import { FooterComponent } from './fixed-part/footer/footer.component';
import { MaterialModule } from '../shared/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeComponent } from './components/employees/employee/employee.component';
import { CabinetService } from './cabinet.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { EmployeeDetailComponent } from './components/employees/employee-detail/employee-detail.component';
import { NewCustomerComponent } from './components/customers/new-customer/new-customer.component';
import { NewEmployeeComponent } from './components/employees/new-employee/new-employee.component';
import { DeleteComponent } from './components/dialogs/delete/delete.component';
import { ChangePasswordComponent } from './components/dialogs/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MessageDialogComponent } from './components/dialogs/message-dialog/message-dialog.component';



@NgModule({
  declarations: [
    CabinetComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    EmployeeComponent,
    CustomerDetailComponent,
    EmployeeDetailComponent,
    NewCustomerComponent,
    NewEmployeeComponent,
    DeleteComponent,
    ProfileComponent,
    ChangePasswordComponent,
    LoaderComponent,
    MessageDialogComponent,
  ],
  entryComponents: [
    DeleteComponent,
    MessageDialogComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [CabinetService, DatePipe]
})
export class CabinetModule {}
