import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit{
favorites: any[] = []; // Favori ürünleri tutacak array

  constructor(private favoriteService: FavoriteService, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    // Kullanıcı ID'sini almak için route parametrelerini kullanıyoruz
    const userId = this.route.snapshot.paramMap.get('user_id');
    if (userId) {
      this.getFavorites(userId);  // Favorileri alacak fonksiyonu çağırıyoruz
    }
  }

  getFavorites(userId: string) {
    // Backend'den favori ürünleri almak için HTTP isteği
    this.http.get<any[]>(`http://localhost:8000/api/users/favorites/${userId}`).subscribe(
      (data) => {
        this.favorites = data;  // Favori ürünleri dizisine atıyoruz
      },
      (error) => {
        console.error('Favoriler alınamadı', error);  // Hata durumunu konsola yazdırıyoruz
      }
    );
  }

  removeFavorite(productId: string): void {
    // Favorilerden ürün çıkarma işlemi
    const userId = 'kullanıcı_id';  // Burada kullanıcı id'sini almanız gerekir
    this.favoriteService.removeFavorite(userId, productId).subscribe((response) => {
      this.favorites = this.favorites.filter((fav) => fav.id !== productId);  // Favorilerden çıkarılan ürünü listeden kaldırıyoruz
    });
  }
  
}
