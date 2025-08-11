import { Component, OnInit } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = false;
  error: string = '';
  searchQuery: string = '';

  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.filteredUsers = [...this.users]; // ✅ Set filtered users initially
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  editUser(id: string): void {
    this.router.navigate(['/edit-user', id]);
  }

  deleteUser(id: string): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: { message: 'Are you sure you want to delete this user?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== id);
          this.filteredUsers = this.filteredUsers.filter(user => user._id !== id); // Keep filtered list in sync
          this.snackBar.open('User deleted', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
        }
      });
    }
  });
}


  filterUsers(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.filteredUsers = [...this.users]; // ✅ Reset filtered list
  }
}
