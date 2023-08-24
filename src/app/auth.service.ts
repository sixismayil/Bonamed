import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { User } from './models/user';
import jwt_decode from 'jwt-decode';
import { updatePassword ,getAuth} from "firebase/auth";
import { MessageDialogComponent } from './cabinet/components/dialogs/message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UiService } from './shared/services/UiService';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdminUser: any = false 
  username: any = ''
  constructor(public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private dialog: MatDialog,
    public firebaseService: FirebaseService,
    private ui: UiService) {

      //this.getAccessToken()
      this.verifyIdToken()
  }
  verifyIdToken() {
   this.afAuth.signInAnonymously()
    // .then((userCredential) => {
    //   console.log("userCredential",userCredential)
    //   const idToken = userCredential.user!.getIdToken(/* forceRefresh */ true)
    //   console.log("idToken",idToken)
    //   // We get the user from the userCredential,
    //   // but we could very well do firebase.auth().currentUser as well
    //   return userCredential.user!.getIdToken(/* forceRefresh */ true);
    // })
    // .then((idToken) => {
    //   return axios.get(
    //     'https://bonamed-8be11-default-rtdb.firebaseio.com/firebaseio.com/users/ada/name.json?auth=' + idToken
    //   );
    // })
    // .then((response) => {
    //   // handle success
    //   console.log("response",response);
    // })
    // .catch((error) => {
    //   // handle error
    //   console.log(error);
    // });
  }
  getAccessToken() {
    // return admin.credential.applicationDefault().getAccessToken()
    //     .then((accessToken: { access_token: any; }) => {
    //       console.log(accessToken)
    //       return accessToken.access_token;
    //     })
    //     .catch((err: any) => {
    //       console.error('Unable to get access token');
    //       console.error(err);
    //     });
  }
  isAdmin() {
    const userRole = localStorage.getItem('BONAMED_USER_ROLE')!;
    return userRole === 'true'
  }
  returnId() {

    const userRole = localStorage.getItem('BONAMED_USER_ID')!;
    return JSON.stringify(userRole);
  }
  getusername() {
    const decodedToken = jwt_decode(localStorage.getItem('BONAMED_USER_TOKEN')!);
    return JSON.parse(JSON.stringify(decodedToken)).email;
  }
  login(email: string, password: string) {
    this.ui.spin$.next(true);

    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        const userdata = JSON.parse(JSON.stringify(result.user));
        this.firebaseService.getDataByUsername("users", email)
          .subscribe(
            data => {
              if (data.docs[0]) {
                const user = JSON.parse(JSON.stringify(data.docs[0].data()));
                const id = JSON.parse(JSON.stringify(data.docs[0].id));

                this.isAdminUser = user.isAdmin
                console.log('isAdmin', user.isAdmin)
                localStorage.setItem("BONAMED_USER_TOKEN", JSON.stringify(userdata.stsTokenManager.accessToken))
                localStorage.setItem("BONAMED_USER_ROLE", JSON.stringify(user.isAdmin))
                localStorage.setItem("BONAMED_USER_ID", JSON.stringify(id))

                this.router.navigate(['/customers']);
                this.ui.spin$.next(false);
                return
              } else {
                this.ui.spin$.next(false);
                this.messageDialog("Sistemdə xəta baş verdi", false)
              }

            }
          );
      })
      .catch((error) => {
        this.ui.spin$.next(false);
        console.log(error)
        switch (error.code) {
          case 'auth/user-not-found':
            this.messageDialog("İstifadəçi tapılmadı.", false)
            break;
          case 'auth/wrong-password':
            this.messageDialog("İstifadəçinin şifrəsi doğru deyil.", false)
            break;
          case 'auth/invalid-email':
            this.messageDialog("E-poçt ünvanı etibarsızdır", false)
            break;
          default:
            this.messageDialog("Sistemdə xəta baş verdi", false)
        }
      });
  }
  verifyToken() {
    // const auth = getAuth()
    // auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    //   // Send token to your backend via HTTPS
    //   // ...
    // }).catch(function(error: any) {
    //   // Handle error
    // });
  }
  registerUser(user: User) {
    this.ui.spin$.next(true);
    return this.afAuth
      .createUserWithEmailAndPassword(user.username, user.password)
      .then((result) => {
        this.firebaseService.createUser(user)
          .then(
            res => {
             // console.log(res)
              this.ui.spin$.next(false);
              this.messageDialog("İstifadəçi uğurla əlavə edildi", false)
              this.router.navigate(['/employees'])
            }
          )
      })
      .catch((error) => {
        this.ui.spin$.next(false);
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.messageDialog("E-poçt ünvanı artıq başqa hesab tərəfindən istifadə olunur.", false)
            break;
          default:
            this.messageDialog("Sistemdə xəta baş verdi", false)
        }
      });
  }
  deActiveUser(id: string, user: any) {
    this.afAuth
      .signInWithEmailAndPassword(user.username, user.password)
      .then((result: any) => {
        result.user.delete().then((x: any) => {
          this.firebaseService.deleteUser(id)
        }).catch((error: any) => {
          console.log(error)
          this.messageDialog("Sistemdə xəta baş verdi", false)

        })
      }).catch((error => {
        console.log(error)
        this.messageDialog("Sistemdə xəta baş verdi", false)

      }))

  }
  getToken() {
    return localStorage.getItem("BONAMED_USER_TOKEN");
  }
  changePassword(newpassword: string) {
    const auth = getAuth();
    return updatePassword(auth.currentUser!, newpassword)
  }
  changePasswordandUsername(userId: any, user: any, username: string, password: string) {
    this.ui.spin$.next(true);
    if (user.username == username && user.password == password) {
      this.firebaseService.updateUser(userId, user).then((x => {
        this.firebaseService.updateCustomerUsername(username, user.username).subscribe((querySnapshot: { empty: any; docs: any[]; }) => {
          if (!querySnapshot.empty) {
            querySnapshot.docs .forEach(element => {
              element.ref.update({'createUser':user.username});
            });
             this.ui.spin$.next(false);
             this.router.navigate(['/employees'])
          } else {
              console.log("No document corresponding to the query!");
              //this.messageDialog("Sistemdə xəta baş verdi.", false)
              this.ui.spin$.next(false);
              this.router.navigate(['/employees']) 
          }
      });
      })).catch((error) => {
        console.log(error)
        this.ui.spin$.next(false);
        this.messageDialog("Sistemdə xəta baş verdi", false)
      });

    } else {
      this.afAuth
        .signInWithEmailAndPassword(username, password)
        .then((result: any) => {
          result.user.updateEmail(user.username).then((x: any) => {
            result.user.updatePassword(user.password).then((x: any) => {
                this.firebaseService.updateUser(userId, user)
                this.firebaseService.updateCustomerUsername(username, user.username).subscribe((querySnapshot: { empty: any; docs: any[]; }) => {
                      if (!querySnapshot.empty) {
                          querySnapshot.docs .forEach(element => {
                            element.ref.update({'createUser':user.username});
                          });
                         this.ui.spin$.next(false);
                         this.messageDialog("İstifadəçi uğurla yeniləndi.", false)
                         this.router.navigate(['/employees'])
                      } else {
                          console.log("No document corresponding to the query!");
                          this.messageDialog("İstifadəçi uğurla yeniləndi.", false)
                          this.ui.spin$.next(false);
                          this.router.navigate(['/employees']) 
                      }
                  });
             
            }).catch((error: any) => {
              console.log(error)
              result.user.updateEmail(username)
              this.ui.spin$.next(false);
              switch (error.code) {
                case 'auth/user-not-found':
                  window.alert("İstifadəçi tapılmadı.")
                  break;
                case 'auth/email-already-in-use':
                  window.alert("E-poçt ünvanı artıq başqa hesab tərəfindən istifadə olunur.")
                  break;
                case 'auth/wrong-password':
                  window.alert("İstifadəçinin şifrəsi doğru deyil.")
                  break;
                case 'auth/weak-password':
                  window.alert("Parol ən azı 6 simvoldan ibarət olmalıdır")
                  break;
                case 'auth/requires-recent-login':
                  this.messageDialog("Bu əməliyyat həssasdır və yenidən autentifikasiya tələb olunur. Bu sorğuya yenidən cəhd etməzdən əvvəl yenidən daxil olun.", false)
                  break;
                case 'auth/too-many-requests':
                  this.messageDialog("Bir çox uğursuz giriş cəhdləri səbəbindən bu hesaba giriş müvəqqəti olaraq deaktiv edilib. Siz parolunuzu sıfırlamaqla onu dərhal bərpa edə bilərsiniz və ya daha sonra yenidən cəhd edə bilərsiniz.", false)
                  break;
                default:
                  this.messageDialog("Sistemdə xəta baş verdi.", false)
              }
            });
          }).catch((error: any) => {
            console.log(error)
            this.ui.spin$.next(false);
            switch (error.code) {
              case 'auth/user-not-found':
                this.messageDialog("İstifadəçi tapılmadı.", false)
                break;
              case 'auth/email-already-in-use':
                this.messageDialog("E-poçt ünvanı artıq başqa hesab tərəfindən istifadə olunur.", false)
                break;
              case 'auth/wrong-password':
                this.messageDialog("İstifadəçinin şifrəsi doğru deyil.", false)
                break;
              case 'auth/invalid-email':
                this.messageDialog("E-poçt ünvanı etibarsızdır", false)
                break;
              case 'auth/weak-password':
                this.messageDialog("Parol ən azı 6 simvoldan ibarət olmalıdır", false)
                break;
              case 'auth/requires-recent-login':
                this.messageDialog("Bu əməliyyat həssasdır və yenidən autentifikasiya tələb olunur. Bu sorğuya yenidən cəhd etməzdən əvvəl yenidən daxil olun.", false)
                break;
              case 'auth/too-many-requests':
                this.messageDialog("Bir çox uğursuz giriş cəhdləri səbəbindən bu hesaba giriş müvəqqəti olaraq deaktiv edilib. Siz parolunuzu sıfırlamaqla onu dərhal bərpa edə bilərsiniz və ya daha sonra yenidən cəhd edə bilərsiniz.", false)
                break;
              default:
                this.messageDialog("Sistemdə xəta baş verdi", false)
            }
          });
        })
        .catch((error) => {
          console.log(error)
          this.ui.spin$.next(false);
          switch (error.code) {
            case 'auth/user-not-found':
              this.messageDialog("İstifadəçi tapılmadı.", false)
              break;
            case 'auth/email-already-in-use':
              this.messageDialog("E-poçt ünvanı artıq başqa hesab tərəfindən istifadə olunur.", false)
              break;
            case 'auth/wrong-password':
              this.messageDialog("İstifadəçinin şifrəsi doğru deyil.", false)
              break;
            case 'auth/invalid-email':
              this.messageDialog("E-poçt ünvanı etibarsızdır", false)
              break;
            default:
              this.messageDialog("Sistemdə xəta baş verdi", false)
          }
        })
        .catch((error) => {
          console.log(error)
          this.ui.spin$.next(false);
          switch (error.code) {
            case 'auth/user-not-found':
              this.messageDialog("İstifadəçi tapılmadı.", false)
              break;
            case 'auth/email-already-in-use':
              this.messageDialog("E-poçt ünvanı artıq başqa hesab tərəfindən istifadə olunur.", false)
              break;
            case 'auth/wrong-password':
              this.messageDialog("İstifadəçinin şifrəsi doğru deyil.", false)
              break;
            case 'auth/invalid-email':
              this.messageDialog("E-poçt ünvanı etibarsızdır", false)
              break;
            default:
              this.messageDialog("Sistemdə xəta baş verdi", false)
          }
        });
    }
  }
  public isAuthenticated(): boolean {
    const token = this.getToken();
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(token!);
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('BONAMED_USER_TOKEN')!);
    return user !== null ? true : false;
  }
  setUserData(user: any) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      username: user.username,
      password: user.password,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      createDate: new Date()
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem("BONAMED_USER_ID")
      localStorage.removeItem('BONAMED_USER_TOKEN');
      localStorage.removeItem('BONAMED_USER_ROLE');
      this.router.navigate(['login']);
    });
  }

  // others 
  public messageDialog(text: string, isRefresh: boolean) {
    this.dialog.open(MessageDialogComponent, {
      width: '500px',
      position: {
        top: '10px',
      },
      data: { Text: `${text}`, isRefresh: isRefresh },
      autoFocus: false,
    });
  }
  public messageObjectDialog(obj: any) {
    this.dialog.open(MessageDialogComponent, {
      width: '650px',
      position: {
        top: '10px',
      },
      data: { obj_message: `${obj}` },
      autoFocus: true,
    });
  }

}


