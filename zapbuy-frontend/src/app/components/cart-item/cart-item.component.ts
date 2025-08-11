import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/models/cart.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChanged = new EventEmitter<number>();
  @Output() remove = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  constructor(private cartService: CartService){}

  onQuantityChange(item: any, newQuantity: number | Event) {
  let newQty: number;

  if (typeof newQuantity === 'number') {
    newQty = Math.max(1, newQuantity); // Prevent quantity < 1
  } else {
    newQty = Math.max(1, +(newQuantity.target as HTMLInputElement).value);
  }

  this.cartService.updateQuantity(item.product._id, newQty).subscribe(() => {
    item.quantity = newQty; // optionally update local value
  });
}


  updateQuantity(newQty: number) {
    // Your logic to update quantity, like:
    this.cartService.updateQuantity(this.item.product._id, newQty).subscribe();
  }

  getDiscountedPrice(item: any): number {
    const price = item.product.price || 0;
    const discount = item.product.discount || 0;
    const quantity = item.quantity || 1;

    const discountedPrice = price - ((discount / 100) * price);
    return  parseFloat((discountedPrice * quantity).toFixed(2));
  }
  
  removeItem() {
    if (this.item?.product?._id) {
      this.remove.emit(this.item.product._id);  // emit productId
    }
  }

  onClearCart() {
    this.clear.emit();
  }

  onCloseCart() {
    this.close.emit();
  }
}
