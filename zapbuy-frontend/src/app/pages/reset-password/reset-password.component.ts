import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token!: string;
  error: string = '';
  success: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const { newPassword, confirmPassword } = this.resetForm.value;

    // Check if form is valid
    if (this.resetForm.invalid) {
      this.error = 'Please fill out the form correctly.';
      this.success = '';
      return;
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      this.error = 'Passwords do not match.';
      this.success = '';
      return;
    }

    // Send to backend
    this.http
      .post(`${environment.apiBaseUrl}/users/reset-password/${this.token}`, {
        newPassword,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Password changed successfully!', '', { duration: 2000 });
          this.error = '';
        },
        error: () => {
          this.snackBar.open('Something went wrong. Please try again.', '', { duration: 2000 });
          this.success = '';
        },
      });
  }
}
