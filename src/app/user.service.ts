import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserDetails(): void {
    this.authService.getUserDetails().subscribe({
      next: (user) => this.userSubject.next(user),
      error: (err) => {
        console.error('Error fetching user details', err);
        this.userSubject.next(null);
      },
    });
  }
}
