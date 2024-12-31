import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';
import { LanguageService } from './language.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, UserInfoComponent] // Add UserInfoComponent here
})
export class AppComponent {
  selectedLanguage: string = 'en';

  constructor(private languageService: LanguageService, private userService: UserService) {
  }

  ngOnInit() {
    this.selectedLanguage = this.languageService.getLanguage();
    // Fetch user info if token exists
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserDetails();
    }
  }

  onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    this.selectedLanguage = language;
    this.languageService.setLanguage(language);
  }
}