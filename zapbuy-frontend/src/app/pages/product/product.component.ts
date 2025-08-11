import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private productService: ProductService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAdminProducts();
  }

  loadAdminProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res: any[]) => {
        this.products = res.filter(p => p.createdBy?.role === 'ADMIN' || p.createdBy?.role === 'SUPER_ADMIN');
        this.filteredProducts = [...this.products];
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  filterProducts(): void {
    this.currentPage = 1;
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.filteredProducts = [...this.products];
    this.currentPage = 1;
  }

  paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages()).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  onDeleteProduct(productId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this product?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(productId).subscribe({
          next: () => {
            this.products = this.products.filter(p => p._id !== productId);
            this.snackBar.open('Product deleted', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }


}
