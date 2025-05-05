
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
