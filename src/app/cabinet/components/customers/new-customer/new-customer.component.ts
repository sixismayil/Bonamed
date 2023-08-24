import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { FirebaseService } from 'src/app/firebase.service';
import { UiService } from 'src/app/shared/services/UiService';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss']
})
export class NewCustomerComponent implements OnInit {
  employeeForm!: FormGroup;
  id = this.r.snapshot.params.id
  isSubmit: boolean = false
  isDisable: boolean = false

  userPhone: string = ''
  constructor(private r: ActivatedRoute, private c: CabinetService, private ui: UiService, private auth: AuthService, private fb: FormBuilder, private firebaseService: FirebaseService, public router: Router,) {
    this.setForm()
  }
  setForm() {
    var username = this.auth.getusername()
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{9}")]],
      address: [''],
      note: ['',],
      birthdate: ['',],
      createUser: [username, Validators.required],
      createDate: [new Date(), Validators.required],
      gender: ['0', Validators.required],
    })
    if (this.id) {
      this.setEditFormForm()
    }
  }
  ngOnInit(): void {

  }
  setEditFormForm() {
    this.ui.spin$.next(true);
    this.firebaseService.getDataById("customers", this.id).subscribe(x => {
      var user = JSON.parse(JSON.stringify(x.data()));
      var xx = this.toDate(user.birthdate.seconds)
      this.userPhone = user.phone
      this.employeeForm.controls.name.setValue(user.name)
      this.employeeForm.controls.surname.setValue(user.surname)
      this.employeeForm.controls.phone.setValue(user.phone)
      this.employeeForm.controls.email.setValue(user.email)
      this.employeeForm.controls.note.setValue(user.note)
      this.employeeForm.controls.gender.setValue(user.gender)
      this.employeeForm.controls.address.setValue(user.address)
      this.ui.spin$.next(false);
      if (user.birthdate != "") this.employeeForm.controls.birthdate.setValue(new Date(this.toDate(user.birthdate)!))

      // const date = new Date(timestamp);

    })
  }
  toDate(date: any) {
    const datePipe = new DatePipe('en-US');
    const myFormattedDate = datePipe.transform(date, 'MM/dd/YYYY');
    return myFormattedDate
  }
  save() {
    this.isSubmit = true
    if (this.employeeForm.invalid) return
    this.ui.spin$.next(true);
    this.isDisable = true
    var userphone = this.employeeForm.controls.phone.value
    if (this.employeeForm.controls.birthdate.value != '') this.employeeForm.controls.birthdate.setValue(this.employeeForm.controls.birthdate?.value?.getTime())
    this.firebaseService.checkCustomerByPhone('customers', userphone).subscribe((value: any) => {
      if (this.id == undefined) {
        if (value.docs.length === 0) {
          this.firebaseService.createCustomers(this.employeeForm.value)
            .then(
              res => {
                this.isDisable = true
                this.auth.messageDialog('Müştəri uğurla əlavə edildi.', false)
                this.ui.spin$.next(false);
                this.router.navigate(['/customers'])
              }
            )
        } else {
          this.auth.messageDialog('Müştəri artıq qeydə alınıb. ', false)
          this.isDisable = false
          this.ui.spin$.next(false);
        }
      } else {
        if (value.docs.length === 0) {
          this.firebaseService.updateCustomer(this.id, this.employeeForm.value)
            .then(
              res => {
                this.auth.messageDialog('Müştəri uğurla yeniləndi.', false)
                this.ui.spin$.next(false);
                this.router.navigate(['/customers'])
              }
            )
        } else if (value.docs.length === 1) {
          if (value.docs[0].data().phone === this.userPhone) {
            this.firebaseService.updateCustomer(this.id, this.employeeForm.value)
              .then(
                res => {
                  this.auth.messageDialog('Müştəri uğurla yeniləndi.', false)
                  this.ui.spin$.next(false);
                  this.router.navigate(['/customers'])
                }
              )
          } else {
            this.auth.messageDialog('Müştəri artıq qeydə alınıb.', false)
            this.ui.spin$.next(false);
            this.isDisable = false
          }
        } else {
          this.auth.messageDialog('Müştəri artıq qeydə alınıb.', false)
          this.ui.spin$.next(false);
          this.isDisable = false
        }
      }
    })
  }
}

