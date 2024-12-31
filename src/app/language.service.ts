import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageKey = 'selectedLanguage';

  constructor() {
    this.initLanguage();
  }

  setLanguage(language: string): void {
    localStorage.setItem(this.languageKey, language);
  }

  getLanguage(): string {
    return localStorage.getItem(this.languageKey) || 'en';
  }

  private initLanguage(): void {
    if (!localStorage.getItem(this.languageKey)) {
      this.setLanguage('en');
    }
  }
}