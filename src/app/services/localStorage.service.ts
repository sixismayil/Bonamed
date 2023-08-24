// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import * as CryptoJS from 'crypto-js';
// import * as SecureStorage from 'secure-web-storage';
// @Injectable({
//   providedIn: 'root',
// })

// export class LocalStorageService extends BaseService {
//   myAppUrl: string = AppConfig.settings.other.resourceApiURI;
//   secureStorage:any;
//   constructor(public router: Router) {
//     super();
//      this.clearStorage();
//      this.Storage();
//   }
//   Storage(){
//     var secret_Key = AppConfig.settings.keys.secretKey;
//     this.secureStorage = new SecureStorage(localStorage, {

//       // Encrypt the localstorage data
//       encrypt: function encrypt(data) {
//         data = CryptoJS.AES.encrypt(data, secret_Key);
//         data = data.toString();
//         return data;
//       },
//       // Decrypt the encrypted data
//       decrypt: function decrypt(data) {
//         data = CryptoJS.AES.decrypt(data, secret_Key);
//         data = data.toString(CryptoJS.enc.Utf8);
//         return data;
//       },
//       hash: function hash(key) {
//         key = CryptoJS.SHA256(key, secret_Key);
//         return key.toString();
//     }
//     });
//   }
//   getLocalStorage(localType, key) {

//     if (this.secureStorage.getItem(localType)) {
//       let data = JSON.parse(this.secureStorage.getItem(localType));
//       return data[key];
//     }
//   }
//   setLocalStorage(localType, key, value) {
//     if (this.secureStorage.getItem(localType)) {
//       let data = JSON.parse(this.secureStorage.getItem(localType));
//       console.log(data)
//       data[key] = value;
//       this.secureStorage.setItem(localType, JSON.stringify(data));
//     } else {
//       this.router.navigate(["/"]);
//     }
//   }
//  // set to localstarge  
//  setJsonValue(key: string, value: any) {
//   this.secureStorage.setItem(key, value);
// }
// // get value form localstarge
// getJsonValue(key: string) {
//   return this.secureStorage.getItem(key);
// }
//   clearStorage() {
//     var hours = AppConfig.settings.other.clearStorageHour;
//     var now = new Date().getTime();
//     var setupTime = localStorage.getItem('setupTime');
//     if (setupTime == null) {
//       localStorage.setItem('setupTime', now.toString())
//     } else {
//       if (now - parseInt(setupTime) > hours * 60 * 60 * 1000) {
//         var lang = localStorage.getItem('lang');
//         localStorage.clear();
//         localStorage.setItem('lang', lang);
//         window.location.reload();
//         localStorage.setItem('setupTime', now.toString());
//       }
//     }
//     if (document.getElementsByClassName("grecaptcha-badge") && document.getElementsByClassName("grecaptcha-badge")[0] && document.getElementsByClassName("grecaptcha-badge")[1]) {
//       let element = document.getElementsByClassName("grecaptcha-badge") as HTMLCollectionOf<HTMLElement>;
//       element[0].style.display = 'none';
//     }

//   }
 
// }
