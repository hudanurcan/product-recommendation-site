import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  products: any[] = []; // Ürünleri tutmak için bir dizi

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.filteredProducts$.subscribe((filteredProducts) => {
      this.products = filteredProducts;
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        console.log('Ürünler alındı:', data);
        this.productService.setProducts(data); // Ürünleri ProductService'e ata.
      },
      (error) => {
        console.error('Ürünler alınamadı:', error);
      }
    );
  }
}