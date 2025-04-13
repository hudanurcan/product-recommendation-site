import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common'; // isPlatformBrowser import edilmelidir

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit{
  userId: string | null = null; // Kullanıcı ID'si
  favorites: any[] = []; // Favori ürünler listesi

  constructor(
    private favoritesService: FavoriteService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Burada localStorage'a erişebilirsiniz
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      this.userId = currentUser.user_id;
      console.log('User ID from localStorage:', this.userId); // Burada kullanıcı ID'sinin doğru alındığını kontrol edin.
      if (this.userId) {
        console.log('User ID is valid:', this.userId);
        this.loadFavorites();
      } else {
        console.error('User ID not found in localStorage');
      }
    }
  }
  
  loadFavorites(): void {
    if (this.userId) {
      this.favoritesService.getFavorites(this.userId).subscribe(
        (response) => {
          console.log('Favorites response:', response); // API'den gelen yanıtı kontrol et
          this.favorites = response.favorites; // Gelen veriyi işleyin
          console.log('Favorites:', this.favorites); // Favorileri konsola yazdırın
          console.log('Received Favorites:', this.favorites);  // Resim verisinin burada olup olmadığını kontrol et
        },
        (error) => {
          console.error('Favorites yüklenemedi:', error); // Hata varsa konsola yazdırın
        }
      );
    }
  }
}
