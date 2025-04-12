import { Component, OnInit, Inject, ChangeDetectorRef  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-loginpage',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit{
//   credentials = {
//     email: '',
//     password: ''
//     // login sayfasında kullanıcıdan alınacak bilgileri tutar. html'de ngModel ile bağlanır
//   };

//   email: string = '';
// password: string = '';

//   constructor(private router: Router, private authService: AuthService) {}

//   onSubmit(): void {
//     this.authService.login(this.credentials).subscribe({ // authService'de tanımlanan login metodunu çağırır. subscribe : backendden gelen cevabı dinler.
//       // kullanıcının loginde girdiği credentials verilerini alır ve backende gönderir.

//       next: (response: any) => {
//         console.log('Giriş başarılı:', response);
//         this.router.navigate(['/']); // başarılı giriş sonrası router işlemi ( homepage )
//       },
//       error: (err: any) => {
//         console.error('Giriş hatası:', err);
//       }
//     });
//   }
//   onLogin() {
//     const credentials = {
//       email: this.email,
//       password: this.password
//     };
  
//     this.authService.login(credentials).subscribe({
//       next: () => {
//         this.router.navigate(['/home']);
//       },
//       error: err => {
//         console.error('Giriş hatası:', err);
//       }
//     });
//   }

  // Kullanıcı bilgilerini tutan credentials objesi
  credentials = {
    email: '',
    password: ''
  };
  
  // email : string= '';
  // password : string = '';
  currentUser: any; // Kullanıcı bilgisini tutacak
  constructor(private router: Router, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object,    private cdr: ChangeDetectorRef) {}

  // ngOnInit() {
  //   // localStorage'dan 'currentUser' verisini alıyoruz
  //   const userData = localStorage.getItem('currentUser');
    
  //   // Eğer kullanıcı verisi mevcutsa
  //   if (userData) {
  //     // Veriyi parse edip currentUser'a atıyoruz
  //     this.currentUser = JSON.parse(userData);
      
  //     // Eğer currentUser'da user_id varsa, giriş yapan kullanıcıyı gösteriyoruz
  //     if (this.currentUser && this.currentUser.user_id) {
  //       console.log('Giriş yapılmış kullanıcı:', this.currentUser);
  //       console.log("Giriş yapan kullanıcı ID:", this.currentUser.user_id);  // Kullanıcı ID'sini konsola yazdır
  //     } else {
  //       // Eğer currentUser'da user_id yoksa, kullanıcı girişi yapılmamış demektir
  //       console.log('Kullanıcı girmemiş.');
  //     }
  //   } else {
  //     // Eğer localStorage'da currentUser yoksa, kullanıcı girişi yapılmamış demektir
  //     console.log('Kullanıcı girmemiş.');
  //   }
  // }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = this.authService.getUser();
      console.log('Login sayfasında mevcut kullanıcı:', currentUser);
      this.cdr.detectChanges(); // 👈 Bu sayede DOM güncellenir
    }
  }

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log("Giriş başarılı:", response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error("Giriş hatası:", error);
      }
    });
  }
}
  
  


  


// onSubmit fonksiyonu : kullanıcı giriş formunu gönderdiğinde çağrılan fonksiyondur.