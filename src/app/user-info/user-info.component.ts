import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  imports: [CommonModule]
})
export class UserInfoComponent implements OnInit {
  userName: string | null = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.userName = user.name;
    });
  }

  goToLogin(): void {
    // Navigate to login page
    window.location.href = '/login';  // Or use Angular router if available
  }
}