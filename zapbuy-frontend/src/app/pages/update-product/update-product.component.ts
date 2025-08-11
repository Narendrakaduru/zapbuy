import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html'
})
export class UpdateProductComponent implements OnInit {
  productId: string = '';
  productForm!: FormGroup;
  selectedFiles: File[] = [];
  existingImages: string[] = [];
  categories: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadProduct();
    this.getCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      discount: [0]
    });
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
          discount: product.discount
        });
        this.existingImages = product.images || [];
      },
      error: (err) => {
        console.error('Failed to load product:', err);
        this.snackBar.open('Failed to load product.', '', { duration: 2000 });
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  updateProduct(): void {
    const formData = new FormData();
    const formValues = this.productForm.value;

    for (const key in formValues) {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    }

    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.snackBar.open('Product updated successfully!', '', { duration: 2000 });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Failed to update product:', err);
        this.snackBar.open('Failed to update product.', '', { duration: 2000 });
      }
    });
  }

  getCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.snackBar.open('Failed to load categories.', '', { duration: 2000 });
      }
    });
  }
}
