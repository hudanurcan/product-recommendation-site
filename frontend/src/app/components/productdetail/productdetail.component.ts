import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-productdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productdetail.component.html',
  styleUrl: './productdetail.component.css'
})



export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: any;  // Ürün detaylarını tutacak değişken

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // URL'den ürün id'sini alıyoruz
    this.productId = this.route.snapshot.paramMap.get('id');
    
    if (this.productId) {
      // Ürün detaylarını almak için HTTP isteği gönderiyoruz
      this.getProductDetail(this.productId).subscribe(
        (data) => {
          this.product = data;
        },
        (error) => {
          console.error("Ürün detayları alınamadı:", error);
        }
      );
    }
  }

  // HTTP GET isteği: Ürün detaylarını backend'den alıyoruz
  getProductDetail(productId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/product/${productId}/`);
  }

  isFavorite = false;

toggleFavorite() {
  this.isFavorite = !this.isFavorite;
  const action = this.isFavorite ? 'add' : 'remove';

  // Backend'e favori ekleme ya da çıkarma isteği gönderiyoruz
  this.http.post('http://localhost:8000/api/users/favorites/', {
    user_id: 'kullanıcı-id',  // Bu değeri oturumda oturum açan kullanıcıdan alacaksınız
    product_id: this.productId,
    action: action
  }).subscribe(
    response => {
      console.log('Favori durumu başarıyla güncellendi', response);
    },
    error => {
      console.error('Favori durumu güncellenemedi', error);
    }
  );
}

  
}