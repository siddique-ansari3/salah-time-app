import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MosqueService } from '../mosque.service';

@Component({
  standalone: true,
  selector: 'app-mosque-details',
  templateUrl: './mosque-details.component.html',
  styleUrls: ['./mosque-details.component.css'],
  imports: [CommonModule]
})
export class MosqueDetailsComponent implements OnInit {
  mosque: any;
  selectedLanguage: string = 'en';  // Default to English

  constructor(
    private route: ActivatedRoute,
    private mosqueService: MosqueService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const mosqueId = params.get('id');
      if (mosqueId) {
        this.fetchMosqueDetails(mosqueId);
      }
    });

    // Get language from localStorage or set default
    this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
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