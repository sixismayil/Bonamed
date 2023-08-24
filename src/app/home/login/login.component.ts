import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public showPassword: boolean | undefined;
  public showPasswordOnPress: boolean | undefined;
  loginForm: FormGroup;
  isSubmit:boolean = false;
  errorMessage:string | undefined
  constructor(private fb: FormBuilder,public authService:AuthService) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: [, Validators.required]
    })
  }
  
  ngOnInit(): void {
  }
  Login(){
    this.isSubmit = true
    if(this.loginForm.invalid)return

    let username = this.loginForm.controls.email.value // +  '@gmail.com'
    let password = this.loginForm.controls.password.value
    this.authService.login(username,password);
  }
}
