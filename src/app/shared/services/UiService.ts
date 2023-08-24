import { Injectable } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';

//cdk
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

//rxjs
import { Observable, Subject } from 'rxjs'
import { mapTo, scan, map, mergeMap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class UiService {

    private spinnerTopRef = this.cdkSpinnerCreate();

    spin$ :Subject<boolean> = new Subject()

    constructor(
        private overlay: Overlay,
    ) {

      this.spin$
        .asObservable()
        .pipe(
          map(val => val ? 1 : -1 ),
          scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
        )
        .subscribe(
          (res) => {
            if(res === 1){ this.showSpinner() }
            else if( res == 0 ){ 
              this.spinnerTopRef.hasAttached() ? this.stopSpinner(): null;
            }
          }
        )
    }

    private cdkSpinnerCreate() {
        return this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'dark-backdrop',
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically()
        })
    }

    private showSpinner(){
      if(!this.spinnerTopRef.hasAttached()){
        this.spinnerTopRef.attach(new ComponentPortal(MatSpinner))
      }
     
    }
    private stopSpinner(){
      this.spinnerTopRef.detach() ;
    }
}