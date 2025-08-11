import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.css']
})
export class CartDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public cart: any,
    private dialogRef: MatDialogRef<CartDialogComponent>,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity).subscribe(updated => {
      this.cart.items = updated.items;
    });
  }

  removeItem(productId: string) {
    this.cartService.removeItem(productId).subscribe(updated => {
      this.cart.items = updated.items;
      this.loadCart();
    });
  }

  getDiscountedPrice(item: any): number {
    const price = item.product.price || 0;
    const discount = item.product.discount || 0;
    const quantity = item.quantity || 1;

    const discountedPrice = price - ((discount / 100) * price);
    return discountedPrice * quantity;
  }

  removeCartItem(productId: string) {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.loadCart(); // ✅ Reload cart from server after removal
      },
      error: (err) => {
        console.error('Error removing item:', err);
      }
    });
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe(() => {
      this.cart.items = [];
    });
  }

  getTotalCost(): number {
    const total = this.cart?.items?.reduce((total: number, item: any) => {
      const price = item.product.price || 0;
      const discount = item.product.discount || 0;
      const quantity = item.quantity || 1;

      const discountedPrice = price - ((discount / 100) * price);
      return total + (discountedPrice * quantity);
    }, 0) || 0;

    return parseFloat(total.toFixed(2));
  }


  close() {
    this.dialogRef.close();
  }

  placeOrder() {
    // You can emit an event, call an order service, or redirect to a checkout page
    console.log('Placing order...');
    // Example: this.orderService.placeOrder(this.cart.items).subscribe(...)
  }

}
