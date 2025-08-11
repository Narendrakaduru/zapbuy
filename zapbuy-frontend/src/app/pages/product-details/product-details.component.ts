import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from '../../services/product.service';  // <-- import ProductService

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;
  mainImage: string = '';
  mainImageIndex: number = 0;
  newComment: string = '';

  baseURL = 'http://localhost:8000'; // Change to your backend API base URL

  constructor(
    private route: ActivatedRoute, 
    private cartService: CartService,
    private userService: UserService,
    private productService: ProductService,  // <-- inject here
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.getProduct(productId);
    }
  }

  getProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        this.product = res;
        if (this.product?.images?.length) {
          this.mainImage = this.product.images[0];
          this.mainImageIndex = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }

  changeImage(img: string) {
    this.mainImage = img;
    this.mainImageIndex = this.product.images.indexOf(img);
  }

  addToCart(product: any) {
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

  submitComment() {
    if (!this.newComment.trim()) return;

    this.productService.addComment(this.product._id, this.newComment.trim())
      .subscribe({
        next: (res) => {
          this.product.comments.push(res.comment);
          this.getProduct(this.product!._id);
          this.newComment = '';
        },
        error: (err) => {
          console.error('Failed to add comment', err);
          alert('Failed to add comment. Please try again.');
        }
      });
  }
}
