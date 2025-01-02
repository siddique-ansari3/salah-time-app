import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MosqueService } from '../mosque.service';
import { Language } from '../models/language.model';
import { Subscription } from 'rxjs';
import { LanguageService } from '../language.service';

@Component({
  standalone: true,
  selector: 'app-mosque-details',
  templateUrl: './mosque-details.component.html',
  styleUrls: ['./mosque-details.component.css'],
  imports: [CommonModule]
})
export class MosqueDetailsComponent implements OnInit {
  mosque: any;
  selectedLanguage: Language = 'en';
  languageSubscription: Subscription | null = null;  // Initialize as null
    
  constructor(
    private route: ActivatedRoute,
    private mosqueService: MosqueService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const mosqueId = params.get('id');
      if (mosqueId) {
        this.fetchMosqueDetails(mosqueId);
      }
    });

    this.selectedLanguage = this.languageService.getLanguage();
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLanguage = lang;
      // Optionally, you can trigger actions based on language change
    });
  }

  fetchMosqueDetails(mosqueId: string): void {
    this.mosqueService.getMosqueById(mosqueId).subscribe({
      next: (data) => {
        this.mosque = data;
      },
      error: (err) => {
        console.error('Error fetching mosque details', err);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}