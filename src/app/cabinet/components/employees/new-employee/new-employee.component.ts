import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { FirebaseService } from 'src/app/firebase.service';
import { UiService } from 'src/app/shared/services/UiService';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {
  fieldTextType: boolean | undefined;
  repeatFieldTextType: boolean | undefined;
  employeeForm!: FormGroup
  isSubmit: boolean = false;
  id = this.r.snapshot.params.id
  oldUsername:string = ''
  oldPassword:string = ''
  constructor(  public router: Router,private r: ActivatedRoute,private ui : UiService,public cabinetService: CabinetService, private firebaseService: FirebaseService, private fb: FormBuilder, private authService: AuthService) {
   
  }
  ngOnInit(): void {
    this.setForm()
    if (this.id) {this.setEditFormForm()
    }
  }
  setForm(){
    this.employeeForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      isAdmin: [false, Validators.required],
      isActive: [true, Validators.required],
      createDate: [new Date(), Validators.required],
      updateDate: [new Date(), Validators.required]
    })
  }
  setEditFormForm(){
    this.ui.spin$.next(true);
    this.firebaseService.getDataById("users", this.id).subscribe(x => {
    var user = JSON.parse(JSON.stringify(x.data()));
     this.oldPassword = user.password
     this.oldUsername = user.username
     this.employeeForm.controls.username.setValue(user.username)
     this.employeeForm.controls.password.setValue(user.password)
     this.employeeForm.controls.repassword.setValue(user.repassword)
     this.employeeForm.controls.isAdmin.setValue(user.isAdmin)
     this.employeeForm.controls.updateDate.setValue(new Date())
     this.ui.spin$.next(false);
  });    
  }
  save() {
    this.isSubmit = true
    if (this.employeeForm!.invalid) {
      return
    }
    if (this.employeeForm.controls.password.value !== this.employeeForm.controls.repassword.value) {
      this.authService.messageDialog("Şifrə və təkrar şifrə uyğun deyil.", false);
      return
    }    
    this.ui.spin$.next(true);
    if (!this.id) {
      this.authService.registerUser(this.employeeForm.value);
    } else {
    this.authService.changePasswordandUsername(this.id ,this.employeeForm.value,this.oldUsername, this.oldPassword)
     
    }
    this.ui.spin$.next(false);
  }

  //eye-icon
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }
  
}
