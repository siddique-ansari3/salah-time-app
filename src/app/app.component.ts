import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';
import { LanguageService } from './language.service';
import { UserService } from './user.service';
import { Language } from './models/language.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, UserInfoComponent, FormsModule] // Add UserInfoComponent here
})
export class AppComponent {
  selectedLanguage: Language = 'en';

  constructor(private languageService: LanguageService, private userService: UserService) {
  }

  ngOnInit() {
    this.languageService.language$.subscribe((lang) => {
      this.selectedLanguage = lang;
    });
    //this.selectedLanguage = this.languageService.getLanguage();
    // Fetch user info if token exists
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserDetails();
    }
  }

  onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    if (language === 'en' || language === 'ur') {
      this.selectedLanguage = language;
      this.languageService.setLanguage(language);
    }
  }
}