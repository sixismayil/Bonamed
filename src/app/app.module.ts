

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './home/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './shared/material/material.module';
import { CabinetModule } from './cabinet/cabinet.module';
import { CabinetService } from './cabinet/cabinet.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { DeleteComponent } from './cabinet/components/dialogs/delete/delete.component';
import { LoaderInterceptor } from './services/loader.interceptor';
import { AuthService } from './auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';



@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule,
    HomeModule,
    CabinetModule,
    
  ],
  providers: [CabinetService,AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule { }
