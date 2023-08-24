import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { UiService } from '../shared/services/UiService';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private accountService: AuthService,private ui : UiService,) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    this.ui.spin$.next(true);

    var token = this.accountService.getToken();
    console.log( "token",token)
    req = req.clone({
      setHeaders: { Authorization: "bearer " + token }
    });
    return next.handle(req).pipe(finalize(() =>   this.ui.spin$.next(false)));;
  }
}
