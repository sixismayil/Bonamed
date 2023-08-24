import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { CustomerComponent } from '../cabinet/components/customers/customer/customer.component';

@NgModule({
  declarations: [CustomerComponent],
  providers: [CabinetService],
  imports: [CommonModule, RouterModule, HomeRoutingModule, MaterialModule],
})
export class HomeModule {}
