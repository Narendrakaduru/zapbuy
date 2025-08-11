import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, userData);
  }

  sendVerificationCode(data: { email: string }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/send-code`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.BASE_URL}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
      })
    );
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(
      `${this.BASE_URL}/forgot-password`,
      { email }
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getLoggedInUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.BASE_URL, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
