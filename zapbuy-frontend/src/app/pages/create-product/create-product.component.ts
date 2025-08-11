// src/app/components/create-product/create-product.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html'
})
export class CreateProductComponent implements OnInit {

  productForm!: FormGroup;
  selectedFiles: File[] = [];
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      discount: [0],
      stock: [0]
    });

    this.getCategories();
    
  }

  onFileChange(event: any): void {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      // Append product fields
      Object.entries(this.productForm.value).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // Append all image files
      this.selectedFiles.forEach(file => {
        formData.append('images', file); // backend expects field name 'images'
      });

      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.snackBar.open('Product created successfully!', '', { duration: 2000 });
          this.productForm.reset();
          this.selectedFiles = [];
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        },
        error: () => {
          this.snackBar.open('Failed to create product.', '', { duration: 2000 });
        }
      });
    }
  }

  getCategories(): void {
  this.productService.getCategories().subscribe({
    next: (res) => {
      this.categories = res;
    },
    error: (err) => {
      console.error('Error fetching categories:', err);
    }
  });

  }
  
}
