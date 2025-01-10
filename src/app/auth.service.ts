import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  getUserDetails(): Observable<any> {
    if (this.isAuthenticated()) {
      const token = localStorage.getItem('token');

      let headers = new HttpHeaders();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }

      return this.http.get(`${this.apiUrl}/auth/user`, { headers }).pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error('Unauthorized');
            localStorage.removeItem('token');
          }
          return throwError(
            () => new Error(error.message || 'Failed to fetch user details')
          );
        })
      );
    } else {
      console.warn('User not authenticated');
      return of(null); // Return an empty observable instead of throwing error
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
