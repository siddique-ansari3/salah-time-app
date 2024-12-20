import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private currentUser = { name: 'John Doe', email: 'johndoe@example.com' }; // Mock user for demo

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    // Mock login: Replace with actual API call if needed
    if (email === 'user@example.com' && password === 'password') {
      this.isAuthenticated = true;
      return of({ success: true });
    } else {
      return of({ success: false });
    }
  }

  register(email: string, password: string): Observable<any> {
    // Mock register: Replace with actual API call if needed
    return of({ success: true });
  }

  getUser() {
    return this.isAuthenticated ? this.currentUser : null;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  logout() {
    this.isAuthenticated = false;
    this.currentUser = null;
  }
}