import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(user)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          this.errorMessage = err.error.message || 'Registration failed';
        }
      });
  }
}