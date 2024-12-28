import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mosque } from '../mosques/mosque.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-mosque-details',
  templateUrl: './mosque-details.component.html',
})
export class MosqueDetailsComponent {
  @Input() mosque!: Mosque;
  @Input() selectedLanguage: 'en' | 'ur' = 'en';  // Accept selectedLanguage as an input

  // Optional: A method to toggle between languages
  toggleLanguage() {
    this.selectedLanguage = this.selectedLanguage === 'en' ? 'ur' : 'en';
  }
}