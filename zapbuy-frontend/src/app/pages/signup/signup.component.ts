import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'] // optional, if needed
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  verifyForm!: FormGroup;
  verificationStep: boolean = false;
  tempUserData: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onRequestVerification(): void {
    if (this.signupForm.valid) {
      const email = this.signupForm.value.email;

      this.userService.sendVerificationCode({ email }).subscribe({
        next: () => {
          this.tempUserData = this.signupForm.value;
          this.verificationStep = true;
          this.snackBar.open('Verification code sent to email.', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to send verification code.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    } else {
      this.snackBar.open('Please fill all fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['snack-warn']
      });
    }
  }

  onSubmit(): void {
    if (this.verifyForm.valid && this.tempUserData) {
      const payload = {
        ...this.tempUserData,
        code: this.verifyForm.value.code
      };

      this.userService.register(payload).subscribe({
        next: () => {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.signupForm.reset();
          this.verifyForm.reset();
          this.verificationStep = false;
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Verification failed or registration error.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
}
