import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://127.0.0.1:8000/api/users/favorites/';

  constructor(private http: HttpClient) {}

  // Favori ürünleri almak için servis fonksiyonu
  getFavorites(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${userId}`);
  }
}
