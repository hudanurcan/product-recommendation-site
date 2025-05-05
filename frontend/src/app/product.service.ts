

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products/'; // Backend API URL
  private allProducts: any[] = []; // API'den alınan tüm ürünleri tutacak
  private filteredProducts = new BehaviorSubject<any[]>([]); // Filtrelenmiş ürünleri tutar

  filteredProducts$ = this.filteredProducts.asObservable(); // Filtrelenmiş ürünlere abone olunabilir

  

  constructor(private http: HttpClient) {}

  // API'den ürünleri çekip kaydeder
  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl); // API'den ürünleri çeker
  }

  // Tüm ürünleri alıp bellekte saklar
  setProducts(products: any[]): void {
    this.allProducts = products; // API'den alınan tüm ürünleri bellekte sakla
    this.filteredProducts.next(products); // İlk durumda tüm ürünleri göster
  }

  // Arama terimine göre ürünleri filtreler
  filterProducts(searchTerm: string): void {
    const filtered = this.allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.filteredProducts.next(filtered); // Filtrelenmiş ürünleri günceller
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:8000/api/products/${category}/`);
  }

}

interface Product {
  id: string;
  name: string;
  price: string;
  images: string[];
}