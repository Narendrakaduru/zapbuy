import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  message = '';
  error = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;

    this.userService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error?.error || 'Something went wrong', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
}
