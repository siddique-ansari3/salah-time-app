import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MosqueService } from '../mosque.service';
import { Mosque } from './mosque.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MosqueDetailsComponent } from '../mosque-details/mosque-details.component';

@Component({
  selector: 'app-mosques',
  standalone: true,
  imports: [CommonModule, FormsModule, MosqueDetailsComponent],
  templateUrl: './mosques.component.html',
  styleUrl: './mosques.component.css',
})
export class MosquesComponent {
  mosques: Mosque[] = [];
  filteredMosques: Mosque[] = [];
  searchQuery: string = '';
  selectedLanguage: 'en' | 'ur' = 'en';  // Default to English
  filters = {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    juma: false,
  };
  selectedMosque: Mosque | null = null;

  newMosque: Mosque = {
    name: { en: '', ur: '' },
    location: { en: '', ur: '' },
    timings: {
      fajr: { en: '', ur: '' },
      dhuhr: { en: '', ur: '' },
      asr: { en: '', ur: '' },
      maghrib: { en: '', ur: '' },
      isha: { en: '', ur: '' },
      juma: { en: '', ur: '' },
    },
  };
  isEditing = false;

  sortBy: string = 'name';  
  sortOrder: 'asc' | 'desc' = 'asc'; 

  constructor(
    private mosqueService: MosqueService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMosques();
  }

  loadMosques() {
    this.mosqueService.getMosques().subscribe((mosques: Mosque[]) => {
      this.mosques = mosques;
      this.filteredMosques = mosques; 
      this.applySorting();
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  goToLogin() {
    this.router.navigate(['/login']);  // Adjust to your actual login route
  }
  
  applySorting() {
    this.filteredMosques.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'name') {
        comparison = a.name[this.selectedLanguage].localeCompare(b.name[this.selectedLanguage]);
      } else if (this.sortBy === 'location') {
        comparison = a.location[this.selectedLanguage].localeCompare(b.location[this.selectedLanguage]);
      } else {
        comparison = this.compareTimings(a, b);
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }
  
  compareTimings(a: Mosque, b: Mosque): number {
    const timeA = a.timings[this.sortBy as keyof typeof a.timings][this.selectedLanguage];
    const timeB = b.timings[this.sortBy as keyof typeof b.timings][this.selectedLanguage];
    
    const timeAInMinutes = this.convertTimeToMinutes(timeA);
    const timeBInMinutes = this.convertTimeToMinutes(timeB);
    
    return timeAInMinutes - timeBInMinutes;
  }
  
  convertTimeToMinutes(time: string): number {
    if (!time) return -1;  
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  searchMosques() {
    this.filteredMosques = this.mosques.filter((mosque) =>
      (mosque.name[this.selectedLanguage].toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        mosque.location[this.selectedLanguage].toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      this.filterByTimings(mosque)
    );
    this.applySorting();
  }
  
  filterByTimings(mosque: Mosque): boolean {
    const timings = mosque.timings;
    return (
      (this.filters.fajr ? timings.fajr[this.selectedLanguage] !== '' : true) &&
      (this.filters.dhuhr ? timings.dhuhr[this.selectedLanguage] !== '' : true) &&
      (this.filters.asr ? timings.asr[this.selectedLanguage] !== '' : true) &&
      (this.filters.maghrib ? timings.maghrib[this.selectedLanguage] !== '' : true) &&
      (this.filters.isha ? timings.isha[this.selectedLanguage] !== '' : true) &&
      (this.filters.juma ? timings.juma[this.selectedLanguage] !== '' : true)
    );
  }

  filterTimings() {
    this.filteredMosques = this.mosques.filter((mosque) =>
      (this.filters.fajr ? mosque.timings.fajr[this.selectedLanguage] !== '' : true) &&
      (this.filters.dhuhr ? mosque.timings.dhuhr[this.selectedLanguage] !== '' : true) &&
      (this.filters.asr ? mosque.timings.asr[this.selectedLanguage] !== '' : true) &&
      (this.filters.maghrib ? mosque.timings.maghrib[this.selectedLanguage] !== '' : true) &&
      (this.filters.isha ? mosque.timings.isha[this.selectedLanguage] !== '' : true) &&
      (this.filters.juma ? mosque.timings.juma[this.selectedLanguage] !== '' : true)
    );
  }

  editMosque(mosque: Mosque): void {
    if (this.authService.isAuthenticated()) {
      this.newMosque = { ...mosque };
      this.isEditing = true;
    }
  }

  addOrUpdateMosque(): void {
    if (this.isEditing && this.newMosque._id) {
      this.mosqueService.updateMosque(this.newMosque._id, this.newMosque).subscribe(() => {
        this.loadMosques();
        this.resetForm();
      });
    } else {
      this.mosqueService.addMosque(this.newMosque).subscribe(() => {
        this.loadMosques();
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.newMosque = {
      name: { en: '', ur: '' },
      location: { en: '', ur: '' },
      timings: {
        fajr: { en: '', ur: '' },
        dhuhr: { en: '', ur: '' },
        asr: { en: '', ur: '' },
        maghrib: { en: '', ur: '' },
        isha: { en: '', ur: '' },
        juma: { en: '', ur: '' },
      },
    };
    this.isEditing = false;
  }

  deleteMosque(id: string) {
    if (this.authService.isAuthenticated()) {
      this.mosqueService.deleteMosque(id).subscribe(() => {
        this.mosques = this.mosques.filter((mosque) => mosque._id !== id);
        this.searchMosques();
      });
    }
  }

  changeLanguage(lang: 'en' | 'ur') {
    this.selectedLanguage = lang;
    this.applySorting();
    this.searchMosques();
  }

  viewMosqueDetails(mosque: Mosque): void {
    this.selectedMosque = mosque;
    console.log(mosque);
    this.router.navigate(['/mosque-details', mosque._id]);
  }

  goBack(): void {
    this.selectedMosque = null;
    this.router.navigate(['/mosques']);
  }

  changeSortOrder(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
  
    if (this.sortBy === value) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = value;
      this.sortOrder = 'asc';
    }
  
    this.applySorting();
  }
}