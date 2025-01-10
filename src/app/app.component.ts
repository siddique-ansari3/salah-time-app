import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInfoComponent } from './user-info/user-info.component';
import { LanguageService } from './language.service';
import { UserService } from './user.service';
import { Language } from './models/language.model';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, UserInfoComponent, FormsModule, TranslateModule],
})
export class AppComponent {
  selectedLanguage: Language = 'en';

  constructor(
    private languageService: LanguageService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Sync translation service with language changes
    this.languageService.language$.subscribe((lang) => {
      this.selectedLanguage = lang;
      this.translate.use(lang);
    });

    // Fetch user details if token exists
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserDetails();
    }
  }

  onLanguageChange(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as Language;
    if (language === 'en' || language === 'ur') {
      this.languageService.setLanguage(language);
    }
  }

  showAllMosques(): void {
    window.location.href = '/';
  }
}
