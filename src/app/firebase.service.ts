import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Customer } from './models/customer';
import { User } from './models/user';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore,  private http: HttpClient,
  ) {}

 // get
  getDataById(collKey:string,id:any){
    return this.db.collection(collKey).doc(id).get();
  }
  getDataByUsername(collKey:string,username:any){
    
   return this.db.collection(collKey, ref => ref.where('username', '==', username)).get()
   
  }
  checkCustomerByPhone(collKey:string,phone:any){
    return this.db.collection(collKey, ref => ref.where('phone', '==', phone)).get()
   
   }
   testRequest(id: string): Observable<any> {
    console.log("test")
    const myAppUrl = "https://firestore.googleapis.com/v1/projects/bonamed-8be11/databases/(default)/documents/cities/LA"
    let url =  "https://firestore.googleapis.com/v1/projects/bonamed-8be11/databases/(default)/documents/customers2";
    let url2 = "https://bonamed-8be11-default-rtdb.firebaseio.com/users/ada/name.json?access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjMzdkNTkzNjVjNjIyOGI4Y2NkYWNhNTM2MGFjMjRkMDQxNWMxZWEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm9uYW1lZC04YmUxMSIsImF1ZCI6ImJvbmFtZWQtOGJlMTEiLCJhdXRoX3RpbWUiOjE2NjcxMzgwODgsInVzZXJfaWQiOiJmNkVROTJUWFhwUk1Ub2pCb3ZuejVyZmlNUXMyIiwic3ViIjoiZjZFUTkyVFhYcFJNVG9qQm92bno1cmZpTVFzMiIsImlhdCI6MTY2NzEzODA4OCwiZXhwIjoxNjY3MTQxNjg4LCJlbWFpbCI6ImFkbWluQGJvbmFtZWQuYXoiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRtaW5AYm9uYW1lZC5heiJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.kqnaVWc8ushgZmQq-UHrVXgD1ttltbmsvg_kHrbbB97z8H10prTJPMP6Qfm6Xepkqne0DleMC_WLJ8hWvFWfL9iV_wiC5Js2dNsWI71OwXmRtIRFez7qWez2wXa0dGW3H76h93f1Lb4GMvzzWOxmd0eT7SapmC4maO9VbWkQlEKAsJIYpmqzS2d08JE3SopfkfvbUv4DGpK2PLGDYzk2Vx10MR5jnVc_WYf8rrkly9DI6mZwvEtu12_-wbXIUrsO3UGH0gtBPqkj94fdizJMjxvqCQIyTPWfOYq9WPMtABiqyxNoMQdxRpRge0ucQxrCS0uRULc0Zg7sdqoMDHPV8Q"
    console.log("test",url2)
    
    return this.http.get<any>(url2);
  }
  getDataList(collKey:string,createUser:any,isAdmin:boolean){
    this.testRequest("xx") 
    if(isAdmin){
      return this.db.collection(collKey).snapshotChanges();
    }else{
      return this.db.collection(collKey, ref => ref.where('createUser', '==', createUser)).snapshotChanges()
    }
  }
  getDataUserList(username:any){
    console.log( this.db)
    return this.db.collection('users', ref => ref.where('isActive', '==', true )).snapshotChanges()
  }
  //post
  createUser(user: User){
    return this.db.collection('users').add(user);
  }
  createCustomers(customer: Customer){
    return this.db.collection('customers2').add(customer);
  }
  updateUser(id:string, user:User){
    return this.db.collection('users').doc(id).update(user);
  }
  updateCustomer(id:string, customer:Customer){
    return this.db.collection('customers').doc(id).update(customer);
  }
  updateCustomerUsername(username:string, createUser:any){
  //  return this.db.collection('customers').doc(id).update({createUser:createUser});
    return this.db.collection('customers', ref => ref.where('createUser', '==', username)).get()
   
  }
  deleteUser(id:string){
    this.db.collection('users').doc(id).delete()

  }
  deleteCustomer(id:string) {
    this.db.collection('customers').doc(id).delete()
  }
  passwordUpdateUser(id:string,password:any){
     return this.db.collection('users').doc(id).update({"password":password,"repassword":password});
   }
}
