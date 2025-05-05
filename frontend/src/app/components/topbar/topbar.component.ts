import { Component, OnInit,Inject  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {

    // Aktif dropdown takibi
    activeDropdown: string | null = null;
    currentUser: any;
    searchTerm: string = ''; // Arama terimini tutacak değişken.


    categories = {
      women: [
        { name: 'Dış Giyim', link: ['category', 'Kadın', 'Dış Giyim'] },
        { name: 'Pantolon', link: ['category', 'Kadın', 'Pantolon'] },
        { name: 'Elbise', link: ['category', 'Kadın', 'Elbise'] },
        { name: 'Gömlek', link: ['category', 'Kadın', 'Gömlek'] }
      ],
      men: [
        { name: 'Dış Giyim', link: ['category', 'Erkek', 'Dış Giyim'] },
        { name: 'Pantolon', link: ['category', 'Erkek', 'Pantolon'] },
        { name: 'Gömlek', link: ['category', 'Erkek', 'Gömlek'] }
      ]
    };
    constructor(private router: Router, private productService: ProductService, private authService: AuthService,@Inject(PLATFORM_ID) private platformId: Object) {}

    // Dropdown açma
    showDropdown(category: string) {
      this.activeDropdown = category;
    }
  
    // Dropdown kapatma
    hideDropdown() {
      this.activeDropdown = null;
    }


    ngOnInit() {

      if (isPlatformBrowser(this.platformId)) {
        this.authService.getCurrentUserObservable().subscribe((user) => {
          this.currentUser = user;
        });
    }
    }

  onSearch(event: any): void {
    const value = event.target.value.toLowerCase(); // Arama terimini küçük harfe çevir.
    this.searchTerm = value;

    // Ürünleri filtrele
    this.productService.filterProducts(value);
  }

  navigateToHomepage(){
    this.router.navigate(["loginpage"]);
    this.router.navigate(["home"]);
  }
  
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  logRoute(item: any): void {
    console.log('Navigating to:', `/category/${this.encodeValue('Kadın')}/${this.encodeValue(item.name)}`);
  }

  logout() {
    this.authService.logout();  // Çıkış yapma işlemi
    //localStorage.removeItem('currentUser');  // Kullanıcı bilgilerini localStorage'dan kaldırıyoruz
    this.currentUser = null;  // Kullanıcıyı sıfırla
    this.router.navigate(['/home']);  // Ana sayfaya yönlendir
  }
}



