import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  userId: string = '';

  // Filters
  categories: string[] = [];
  brands: string[] = ['Apple', 'Samsung', 'Mi', 'Sony', 'Nike'];
  selectedCategories: string[] = [];
  selectedCategory: string = '';
  selectedBrands: string[] = [];
  selectedPriceRange: string = '';
  mostLiked: boolean = false;

  currentSearchQuery: string = '';

  constructor(
    private productService: ProductService,
    private searchService: SearchService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();

    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = [...res];
        this.filterProducts(); // initial filter
      },
      error: (err) => console.error('Failed to load products', err)
    });

    this.searchService.searchQuery$.subscribe(query => {
      this.currentSearchQuery = query.toLowerCase().trim();
      this.filterProducts();
    });

    this.productService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return decoded.id || decoded._id || '';
  }

  getDiscountedPrice(product: Product): number {
    return product.price - (product.price * product.discount) / 100;
  }

  isProductLiked(product: Product): boolean {
    return product.likes?.includes(this.userId);
  }

  toggleLike(product: Product): void {
    const isLiked = this.isProductLiked(product);

    const observable = isLiked
      ? this.productService.unlikeProduct(product._id)
      : this.productService.likeProduct(product._id);

    observable.subscribe({
      next: () => {
        if (isLiked) {
          product.likes = product.likes.filter(uid => uid !== this.userId);
        } else {
          product.likes.push(this.userId);
        }
        this.filterProducts(); // re-filter on like change
      },
      error: (err) => console.error('Like toggle error:', err)
    });
  }

  filterProducts(): void {
    let filtered = [...this.products];

    // Filter by category
    filtered = filtered.filter(product =>
      this.selectedCategories.length
        ? this.selectedCategories.includes(product.category)
        : true
    );

    // Filter by brand
    filtered = filtered.filter(product =>
      this.selectedBrands.length
        ? this.selectedBrands.some(brand =>
            product.name.toLowerCase().includes(brand.toLowerCase())
          )
        : true
    );

    // Filter by price
    filtered = filtered.filter(product =>
      this.selectedPriceRange
        ? (() => {
            const [min, max] = this.selectedPriceRange.split('-').map(Number);
            return product.price >= min && product.price <= max;
          })()
        : true
    );

    // Filter by most liked
    if (this.mostLiked && this.products.length > 0) {
      const maxLikes = Math.max(...this.products.map(p => p.likes?.length || 0));
      filtered = filtered.filter(product => (product.likes?.length || 0) === maxLikes);
    }

    // Filter by search query
    if (this.currentSearchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.currentSearchQuery)
      );
    }

    this.filteredProducts = filtered;
  }

  // Filter handlers
  onCategoryChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== value);
    }
    this.filterProducts();
  }

  onBrandChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedBrands.push(value);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== value);
    }
    this.filterProducts();
  }

  onPriceRangeChange(event: any): void {
    this.selectedPriceRange = event.target.value;
    this.filterProducts();
  }

  onMostLikedChange(event: any): void {
    this.mostLiked = event.target.checked;
    this.filterProducts();
  }

  addToCart(product: Product) {
    if (!this.userService.isLoggedIn()) {
      this.snackBar.open('Please login to add items to your cart', 'Close', {
        duration: 3000
      });
      return;
    }

    this.cartService.addToCart({ productId: product._id, quantity: 1 }).subscribe({
      next: () => {
        this.snackBar.open(`${product.name} added to cart 🛒`, 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.snackBar.open(`Failed to add ${product.name} ❌`, 'Dismiss', {
          duration: 3000
        });
      }
    });
  }

  
}
