import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { FirebaseService } from 'src/app/firebase.service';
import { getAuth } from "firebase/auth";
import { CabinetService } from 'src/app/cabinet/cabinet.service';
import { UiService } from 'src/app/shared/services/UiService';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  employeeForm!: FormGroup
  isSubmit: boolean = false;
  fieldTextType: boolean | undefined;
  repeatFieldTextType: boolean | undefined;

  constructor(private ui: UiService, public c: CabinetService, public router: Router, private r: ActivatedRoute, private firebaseService: FirebaseService, private fb: FormBuilder, private authService: AuthService) { }

  //eye-icon
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  ngOnInit(): void {
    this.setForm()
  }
  setForm() {
    this.employeeForm = this.fb.group({
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    })
  }

  save() {
    this.isSubmit = true
    if (this.employeeForm!.invalid) {
      return
    }
    if (this.employeeForm.controls.password.value !== this.employeeForm.controls.repassword.value) {
      this.authService.messageDialog("Şifrə və təkrar şifrə uyğun deyil", false)
      return
    }
    this.ui.spin$.next(true);
    var userId = this.authService.returnId()
    this.authService.changePassword(this.employeeForm.controls.password.value).then(() => {
      this.firebaseService.passwordUpdateUser(userId.replace(/"\\"/g, '').replace(/\\""/g, ''), this.employeeForm.controls.password.value).then(() => {
        this.ui.spin$.next(false);
        this.authService.messageDialog("Parol uğurla yeniləndi", true)
      }).catch((error) => {
        console.log(error)
        this.ui.spin$.next(false);
        this.authService.messageDialog("Sistemdə xəta baş verdi", false)
      })
    }).catch((error) => {
      this.ui.spin$.next(false);
      console.log(error)
      switch (error.code) {
        case 'auth/weak-password':
          this.authService.messageDialog("Parol ən azı 6 simvoldan ibarət olmalıdır", false)
          break;
        case 'auth/requires-recent-login':
          this.authService.messageDialog("Bu əməliyyat həssasdır və yenidən autentifikasiya tələb olunur. Bu sorğuya yenidən cəhd etməzdən əvvəl yenidən daxil olun.", false)
          break;
        case 'auth/too-many-requests':
          this.authService.messageDialog("Bir çox uğursuz giriş cəhdləri səbəbindən bu hesaba giriş müvəqqəti olaraq deaktiv edilib. Siz parolunuzu sıfırlamaqla onu dərhal bərpa edə bilərsiniz və ya daha sonra yenidən cəhd edə bilərsiniz.", false)
          break;
        default:
          this.authService.messageDialog("Sistemdə xəta baş verdi", false)
      }
    });
  }
}

