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

  // Kullanıcı bilgilerini tutan credentials objesi
  credentials = {
    email: '',
    password: ''
  };
  
  // email : string= '';
  // password : string = '';
  currentUser: any; // Kullanıcı bilgisini tutacak
  constructor(private router: Router, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object,    private cdr: ChangeDetectorRef) {}

 

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = this.authService.getUser();
      console.log('Login sayfasında mevcut kullanıcı:', currentUser);
      this.cdr.detectChanges(); //  Bu sayede DOM güncellenir
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