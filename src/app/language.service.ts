import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from './models/language.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageKey = 'selectedLanguage';
  private languageSubject: BehaviorSubject<Language> =
    new BehaviorSubject<Language>(this.getStoredLanguage()); // Initialize here

  language$ = this.languageSubject.asObservable(); // Expose the observable to other components

  constructor() {
    // No need for initLanguage() here as the languageSubject is already initialized
  }

  setLanguage(language: Language): void {
    localStorage.setItem(this.languageKey, language);
    this.languageSubject.next(language); // Emit new language value
  }

  getLanguage(): Language {
    return this.languageSubject.value;
  }

  private getStoredLanguage(): Language {
    return (localStorage.getItem(this.languageKey) as Language) || 'en';
  }
}
