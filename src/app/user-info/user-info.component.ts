import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  imports: [CommonModule, TranslateModule]
})
export class UserInfoComponent implements OnInit {
  userName: string | null = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if(user != null){
        this.userName = user.name;
      }
    });
  }

  goToLogin(): void {
    // Navigate to login page
    window.location.href = '/login';  // Or use Angular router if available
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  
  logout(): void {
    localStorage.removeItem('token');
    window.location.reload();  // Refresh to reset state
  }
  
}