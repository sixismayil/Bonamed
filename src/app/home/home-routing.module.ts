import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { CustomerDetailComponent } from '../cabinet/components/customers/customer-detail/customer-detail.component';
import { CustomerComponent } from '../cabinet/components/customers/customer/customer.component';
import { NewCustomerComponent } from '../cabinet/components/customers/new-customer/new-customer.component';
import { ChangePasswordComponent } from '../cabinet/components/dialogs/change-password/change-password.component';
import { EmployeeDetailComponent } from '../cabinet/components/employees/employee-detail/employee-detail.component';
import { EmployeeComponent } from '../cabinet/components/employees/employee/employee.component';
import { NewEmployeeComponent } from '../cabinet/components/employees/new-employee/new-employee.component';
import { ProfileComponent } from '../cabinet/components/profile/profile.component';
import { AuthGuard } from '../guards/auth/AuthGuard';

const routes: Routes = [
  CabinetService.childRoutes([
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
      canActivate: [AuthGuard],
      path: 'customers',
      component: CustomerComponent,
    },
    {
      canActivate: [AuthGuard],
      path: 'employees',
      component: EmployeeComponent,
    },
    {
      canActivate: [AuthGuard],
      path:'profile',
      component: ProfileComponent
    },
    {
      canActivate: [AuthGuard],
      path:'change-password',
      component: ChangePasswordComponent
    },
    {
      canActivate: [AuthGuard],
      path:'customer-detail',
      component: CustomerDetailComponent
    },
    {
      canActivate: [AuthGuard],
      path:'customer-detail/:id',
      component: CustomerDetailComponent
    },
    {
      canActivate: [AuthGuard],
      path:'new-customer',
      component: NewCustomerComponent
    },
    {
      canActivate: [AuthGuard],
      path:'new-customer/:id',
      component: NewCustomerComponent
    },
    {
      canActivate: [AuthGuard],
      path:'employee-detail',
      component: EmployeeDetailComponent
    },
    {
      canActivate: [AuthGuard],
      path:'new-employee',
      component: NewEmployeeComponent
    },
    {
      canActivate: [AuthGuard],
      path:'new-employee/:id',
      component: NewEmployeeComponent
    },
  ])
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}