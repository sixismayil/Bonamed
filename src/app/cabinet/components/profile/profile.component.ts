import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { FirebaseService } from 'src/app/firebase.service';
import { CabinetService } from '../../cabinet.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  employeeForm!: FormGroup
  isSubmit: boolean = false;

  constructor(private c:CabinetService, public router: Router,private r: ActivatedRoute, private firebaseService: FirebaseService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.setForm()
  }
  setForm(){
    this.employeeForm = this.fb.group({
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    })
    this.setEditFormForm()
  }
  setEditFormForm(){
    var username = this.authService.getusername();
    this.firebaseService.getDataByUsername("users", username).subscribe(x => {
  
      // var user = JSON.parse(JSON.stringify(x.docs.data()));
    //  console.log(user)
    //  this.employeeForm.controls.username.setValue(user.username)
    //  this.employeeForm.controls.password.setValue(user.password)
    //  this.employeeForm.controls.repassword.setValue(user.repassword)
    //  this.employeeForm.controls.isAdmin.setValue(user.isAdmin)
    //  this.employeeForm.controls.updateDate.setValue(new Date())
  })
  }
  save() {
   // this.isSubmit = true
    if (this.employeeForm!.invalid) {
      return
    }
    if (this.employeeForm.controls.password.value !== this.employeeForm.controls.repassword.value) {
      this.authService.messageDialog("Şifrə və təkrar şifrə uyğun deyil.", false);
      return
    }
    //this.authService.changePasswordandUsername(this.id ,this.employeeForm.value,this.oldUsername, this.oldPassword)
  }
}
