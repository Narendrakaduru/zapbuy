import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html'
})
export class UpdateUserComponent implements OnInit {
  userId: string = '';
  userForm!: FormGroup;
  roles: string[] = ['USER', 'ADMIN', 'SUPER_ADMIN'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadUser();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required]
    });
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        });
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.snackBar.open('Failed to load user.', '', { duration: 2000 });
      }
    });
  }

  updateUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      this.userService.updateUser(this.userId, userData).subscribe({
        next: () => {
          this.snackBar.open('User updated successfully!', '', { duration: 2000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Failed to update user:', err);
          this.snackBar.open('Failed to update user.', '', { duration: 2000 });
        }
      });
    }
  }

  // Helper method to get form control errors
  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least 2 characters long`;
    }
    return '';
  }
}