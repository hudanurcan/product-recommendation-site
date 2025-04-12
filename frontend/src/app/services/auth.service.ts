// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs'
// import { tap } from 'rxjs/operators';
// import { isPlatformBrowser } from '@angular/common'; // Tarayıcı ortamını kontrol etmek için
// import { Inject, PLATFORM_ID } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })

// Angular'da backend ile iletişim kurmak için oluşturulmuştur.
//  AuthService, authentication işlemlerini gerçekleştirmek için oluşturulan bir servistir. 
// Bu servis, backende HTTP istekleri göndererek kullanıcı verilerini backend'deki API'lere iletir. API'ler, verileri işler ve Angular'a  bir cevap gönderir.
// backend ile iletişim httpClient servisi ile gerçekleşir.

// export class AuthService {
  // private baseUrl = 'http://127.0.0.1:8000/api/users/'; // Backend API URL'si

  // constructor(private http: HttpClient) {}

  // // kullanıcı kaydı için API isteği
  // register(user: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}register/`, user);
  //   // kullanıcı kaydı için backende bir POST isteği gönderir
  // }

  // // Kullanıcı giriş işlemi için API isteği
  // login(credentials: any): Observable<any> {
  //   // credentials: Kullanıcının giriş bilgilerini içerir -> eposta ve şifre
  //   return this.http.post(`${this.baseUrl}login/`, credentials);
  //   // kullanıcının giriş yapması için backende bir POST isteği gönderir. kullanıcının bilgilerini backende gönderir
  // }
 
//  }





// import { Injectable, Inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject  } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { isPlatformBrowser } from '@angular/common';
// import { PLATFORM_ID } from '@angular/core'; // Eksik importları ekleyin


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private baseUrl = 'http://127.0.0.1:8000/api/users/';
//   private currentUser: any = null;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private http: HttpClient
//   ) {
//     if (isPlatformBrowser(this.platformId)) {
//       const savedUser = localStorage.getItem('currentUser');
//       if (savedUser) {
//         try {
//           this.currentUser = JSON.parse(savedUser); // localStorage'dan kullanıcıyı al
//         } catch (e) {
//           console.error('localStorage verisi geçersiz JSON formatında:', e);
//         }
//       }
//     }
//   }

//   // Kullanıcı giriş işlemi
//   login(credentials: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}login/`, credentials).pipe(
//       tap((response: any) => {
//         this.currentUser = response.user;
//         if (isPlatformBrowser(this.platformId)) {
//           // Kullanıcıyı localStorage'a kaydediyoruz
//           localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
//         }
//       })
//     );
//   }

//   // Kullanıcı çıkışı
//   logout(): void {
//     this.currentUser = null;
//     if (isPlatformBrowser(this.platformId)) {
//       // localStorage'dan kullanıcıyı siliyoruz
//       localStorage.removeItem('currentUser');
//     }
//   }

//   // Kullanıcı bilgisi
//   getUser(): any {
//     return this.currentUser;
//   }

//   // Kullanıcı giriş durumu
//   isLoggedIn(): boolean {
//     return this.currentUser !== null;
//   }
//     // // kullanıcı kaydı için API isteği
//   register(user: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}register/`, user);
//     // kullanıcı kaydı için backende bir POST isteği gönderir
//   }
// }




import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core'; // Eksik importları ekleyin
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api/users/';
  private currentUser: any = null;
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser); // localStorage'dan kullanıcıyı al
          this.currentUserSubject.next(this.currentUser); // burayı ekle
        } catch (e) {
          console.error('localStorage verisi geçersiz JSON formatında:', e);
          // Hatalı veriyi temizle
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  // Kullanıcı giriş işlemi
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}login/`, credentials).pipe(
      tap((response: any) => {
        console.log('Backend Yanıtı:', response);
    
        // Yanıtın doğru olup olmadığını kontrol edin
        if (response && response.user_id) {
          this.currentUser = response; // Kullanıcı verisini al
          if (isPlatformBrowser(this.platformId)) {
            try {
              localStorage.removeItem('currentUser');  // Eski veriyi temizle
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));  // Yeni veriyi kaydet
              this.currentUserSubject.next(this.currentUser); // burayı ekle
              console.log("currentUser verisi kaydedildi:", this.currentUser);
            } catch (e) {
              console.error('localStorage verisi kaydedilemedi:', e);
            }
          }
        } else {
          console.error('Geçersiz kullanıcı verisi alındı:', response);
        }
      })
    );
  }
  
  
  

  // login(email: string, password: string): Observable<any> {
  //   const body = { email, password };
  //   return this.http.post<any>(this.baseUrl, body);
  // }

  // Kullanıcı çıkışı
  logout(): void {
    this.currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      // localStorage'dan kullanıcıyı siliyoruz
      localStorage.removeItem('currentUser');
    }
  }

  // Kullanıcı bilgisi
  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        return this.currentUser;
      }
    }
    return null;
  }
  // Kullanıcı giriş durumu
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

    register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, user);
    // kullanıcı kaydı için backende bir POST isteği gönderir
  }
  
getCurrentUserObservable() {
  return this.currentUserSubject.asObservable();
}

}
