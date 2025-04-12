import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/favorites/'; // Backend URL'iniz

  constructor(private http: HttpClient) {}

  // Kullanıcı favorilerini almak için bir method
  getFavorites(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8000/api/users/favorites/${userId}`);
  }

  // Favoriden ürün çıkarma
  removeFavorite(userId: string, productId: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/api/users/favorites/remove`, {
      user_id: userId,
      product_id: productId,
      action: 'remove'
    });
  }

  // Favoriye ürün ekleme
  addFavorite(userId: string, productId: string): Observable<any> {
    return this.http.post<any>(`http://localhost:8000/api/users/favorites/add`, {
      user_id: userId,
      product_id: productId,
      action: 'add'
    });
  }
}
