import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastComponent } from '../toast/toast.component';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})



export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: any;  // Ürün detaylarını tutacak değişken
  userId: string | null = null;
  toastMessage: string = '';
  toastVisible: boolean = false;


  constructor(private route: ActivatedRoute, private http: HttpClient,  @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // URL'den ürün id'sini alıyoruz
    if (isPlatformBrowser(this.platformId)) {
    this.productId = this.route.snapshot.paramMap.get('id');
    const currentUser = localStorage.getItem('currentUser');
    const user = currentUser ? JSON.parse(currentUser) : null;

    this.userId = user?.user_id || null;

    if (this.productId) {
      // Ürün detaylarını almak için HTTP isteği gönderiyoruz
      this.getProductDetail(this.productId).subscribe(
        (data) => {
          this.product = data;
          this.checkIfFavorite(); // favori mi kontrol et
        },
        (error) => {
          console.error("Ürün detayları alınamadı:", error);
        }
      );
    }
  }
  }

  // HTTP GET isteği: Ürün detaylarını backend'den alıyoruz
  getProductDetail(productId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/product/${productId}/`);
  }

  isFavorite = false;

  toggleFavorite() {
    if (!this.userId || !this.productId) return;
  
    const action = this.isFavorite ? 'remove' : 'add';
  
    this.http.post('http://localhost:8000/api/users/favorites/', {
      user_id: this.userId,
      product_id: this.productId,
      action: action
    }).subscribe(
      response => {
        this.isFavorite = !this.isFavorite;
        console.log('Favori durumu güncellendi:', response);
        const msg = this.isFavorite
        ? 'Favorilere eklendi.'
        : 'Favorilerden çıkarıldı.';
        this.showToast(msg);
      },
      error => {
        console.error('Favori durumu güncellenemedi:', error);
        this.showToast('Bir hata oluştu!');
      }
    );
  }
  
  
checkIfFavorite() {
  if (!this.userId) return;

  this.http.get<any>(`http://localhost:8000/api/users/favorites/${this.userId}`).subscribe(
    response => {
      const favorites = response.favorites;
      this.isFavorite = favorites.some((fav: any) => fav.product_id === this.productId);
    },
    error => {
      console.error('Favoriler alınamadı:', error);
    }
  );
}
showToast(message: string) {
  this.toastMessage = message;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 3000); // 3 saniyede kaybolur
}
  
}