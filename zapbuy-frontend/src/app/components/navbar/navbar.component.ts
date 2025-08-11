import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { SearchService } from '../../services/search.service';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';
import { CartDialogComponent } from '../cart-dialog/cart-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  firstName: string | null = null;
  isLoggedIn = false;
  role: string | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartItems: any[] = [];
  cartItemCount: string = '0';
  searchQuery: string = '';
  cartOpen = false;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private searchService: SearchService,
    private router: Router,
    private cartService: CartService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.userService.getLoggedInUser();
    this.isLoggedIn = !!user;
    this.firstName = user?.firstName || null;
    this.role = user?.role || null;

    // ✅ Subscribe to cart updates for instant badge refresh
    this.cartService.cartItems$.subscribe(cart => {
      this.cartItems = cart?.items || [];
      const count = this.cartItems.length;
      this.cartItemCount = count > 9 ? '9+' : count.toString();
      this.cdr.detectChanges();
    });

    // Initial cart load from API
    this.cartService.getCart().subscribe();

    this.loadProducts();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.filteredProducts = res;
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
      },
    });
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.searchService.setSearchQuery(this.searchQuery.trim());
  }

  openCartDialog() {
    this.cartService.getCart().subscribe(cart => {
      this.dialog.open(CartDialogComponent, {
        width: '500px',
        data: cart
      });
    });
  }
}
