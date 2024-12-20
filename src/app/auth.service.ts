import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdminStatus: boolean = false;  // Default to non-admin user status

  constructor() {}

  login(username: string, password: string): boolean {
    // Replace with actual authentication logic
    if (username === 'admin' && password === 'adminpassword') {
      this.isAdminStatus = true;
      return true;
    }
    this.isAdminStatus = false;
    return false;
  }

  logout(): void {
    this.isAdminStatus = false;
  }

  isAdmin(): boolean {
    return this.isAdminStatus;
  }
}