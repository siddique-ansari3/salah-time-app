import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, TranslateModule], // Import CommonModule and FormsModule
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  onSubmit() {
    console.log(this.email);
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.userService.getUserDetails();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Invalid credentials';
        },
      });
  }
}
