import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
  signinForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      this.userService.login(this.signinForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
          this.signinForm.reset();
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        },
        error: () => {
          this.snackBar.open('Login failed. Check credentials.', 'Close', { duration: 2000 });
        }
      });
    }
  }


}
