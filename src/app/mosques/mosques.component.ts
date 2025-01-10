import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { MosqueService } from '../mosque.service';
import { Mosque } from './mosque.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MosqueDetailsComponent } from '../mosque-details/mosque-details.component';
import { LanguageService } from '../language.service';
import { Language } from '../models/language.model';
import { Subscription } from 'rxjs';
import {
  PRAYER_TIMES,
  PrayerTime,
  PrayerType,
  prayerMap,
} from '../constant/prayer-times';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mosques',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './mosques.component.html',
  styleUrl: './mosques.component.css',
})
export class MosquesComponent {
  constructor(
    private mosqueService: MosqueService,
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  mosques: Mosque[] = [];
  filteredMosques: Mosque[] = [];
  searchQuery: string = '';
  selectedLanguage: Language = 'en';
  languageSubscription: Subscription | null = null; // Initialize as null
  uniqueLocations: string[] = [];
  selectedPrayer: PrayerType = 'fajr'; // Default to current prayer
  selectedPrayerKey = this.selectedPrayer.toLowerCase() as PrayerType;
  selectedLocations: { [key: string]: boolean } = {};
  showFilters: boolean = false;
  //currentPrayer: string | null = null;
  nextPrayer: string = '';

  // Use the imported PRAYER_TIMES constant
  prayerTimes: PrayerTime[] = PRAYER_TIMES;

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
  isAddOrUpdateFormVisible = false;

  sortBy: string = 'prayerTime';
  sortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.loadMosques();
    this.selectedLanguage = this.languageService.getLanguage();
    this.languageSubscription = this.languageService.language$.subscribe(
      (lang) => {
        this.selectedLanguage = lang;
        // Optionally, you can trigger actions based on language change
        this.loadMosques();
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed to prevent memory leaks
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  loadMosques() {
    this.mosqueService.getMosques().subscribe((mosques: Mosque[]) => {
      this.mosques = mosques;
      this.filteredMosques = mosques;
      // this.applySorting();
      this.calculateCurrentAndNextPrayer();

      this.uniqueLocations = Array.from(
        new Set(
          this.mosques.map(
            (mosque) =>
              mosque.location[this.selectedLanguage] || mosque.location['en']
          ) // Fallback to 'en' if undefined
        )
      );

      this.uniqueLocations.forEach((location) => {
        this.selectedLocations[location] = true;
      });
    });
  }

  castToPrayerType(prayer: string): PrayerType {
    return prayer as PrayerType;
  }

  // Toggle filter visibility
  toggleFilterVisibility(): void {
    this.showFilters = !this.showFilters;
  }

  // Track selected locations
  onLocationChange(location: string, event: any): void {
    this.selectedLocations[location] = event.target.checked;
  }

  onPrayerChange(prayer: PrayerType): void {
    this.selectedPrayer = prayer;
  }

  // Apply filters
  applyFilters(): void {
    this.filteredMosques = this.mosques.filter((mosque) => {
      const matchesLocation =
        Object.keys(this.selectedLocations).length === 0 ||
        this.selectedLocations[mosque.location[this.selectedLanguage]];

      const selectedPrayerKey = this.selectedPrayer.toLowerCase() as PrayerType;

      const matchesPrayer =
        mosque.timings[selectedPrayerKey]?.[this.selectedLanguage];

      return matchesLocation && matchesPrayer;
    });

    this.applySorting();

    // Hide filters after applying
    this.showFilters = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  goToLogin() {
    this.router.navigate(['/login']); // Adjust to your actual login route
  }

  // Filter based on the selected prayer time
  applyPrayerFilter(): void {
    this.applyFilters();
  }

  applySorting() {
    this.filteredMosques.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'name') {
        comparison = a.name[this.selectedLanguage].localeCompare(
          b.name[this.selectedLanguage]
        );
      } else if (this.sortBy === 'location') {
        comparison = a.location[this.selectedLanguage].localeCompare(
          b.location[this.selectedLanguage]
        );
      } else {
        comparison = this.compareTimings(a, b);
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  compareTimings(a: Mosque, b: Mosque): number {
    const currentPrayer = this.selectedPrayer; // Determine the current prayer dynamically
    if (!currentPrayer) {
      return 0; // No current prayer to compare
    }

    const timeA = a.timings[currentPrayer][this.selectedLanguage];
    const timeB = b.timings[currentPrayer][this.selectedLanguage];
    const timeAInMinutes = this.convertTimeToMinutes12HourFormat(
      timeA,
      currentPrayer
    );
    const timeBInMinutes = this.convertTimeToMinutes12HourFormat(
      timeB,
      currentPrayer
    );
    return timeAInMinutes - timeBInMinutes;
  }

  convertTimeToMinutes12HourFormat(time: string, prayer: string): number {
    const timeParts = time.match(/(\d+):(\d+)/); // Extract hours and minutes
    if (!timeParts) {
      throw new Error(`Invalid time format: ${time}`);
    }

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);

    // Convert hours to 24-hour format based on the prayer sequence
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    if (
      prayerOrder.indexOf(prayer) >= prayerOrder.indexOf('Dhuhr') &&
      hours < 12
    ) {
      hours += 12; // Convert afternoon/evening prayers to PM
    } else if (prayer === 'Fajr' && hours === 12) {
      hours = 0; // Handle midnight as 0 for Fajr
    }

    return hours * 60 + minutes;
  }

  searchMosques() {
    this.filteredMosques = this.mosques.filter(
      (mosque) =>
        (mosque.name[this.selectedLanguage]
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
          mosque.location[this.selectedLanguage]
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())) &&
        this.filterByTimings(mosque)
    );
    this.applySorting();
  }

  filterByTimings(mosque: Mosque): boolean {
    const timings = mosque.timings;
    return (
      (this.filters.fajr ? timings.fajr[this.selectedLanguage] !== '' : true) &&
      (this.filters.dhuhr
        ? timings.dhuhr[this.selectedLanguage] !== ''
        : true) &&
      (this.filters.asr ? timings.asr[this.selectedLanguage] !== '' : true) &&
      (this.filters.maghrib
        ? timings.maghrib[this.selectedLanguage] !== ''
        : true) &&
      (this.filters.isha ? timings.isha[this.selectedLanguage] !== '' : true) &&
      (this.filters.juma ? timings.juma[this.selectedLanguage] !== '' : true)
    );
  }

  filterTimings() {
    this.filteredMosques = this.mosques.filter(
      (mosque) =>
        (this.filters.fajr
          ? mosque.timings.fajr[this.selectedLanguage] !== ''
          : true) &&
        (this.filters.dhuhr
          ? mosque.timings.dhuhr[this.selectedLanguage] !== ''
          : true) &&
        (this.filters.asr
          ? mosque.timings.asr[this.selectedLanguage] !== ''
          : true) &&
        (this.filters.maghrib
          ? mosque.timings.maghrib[this.selectedLanguage] !== ''
          : true) &&
        (this.filters.isha
          ? mosque.timings.isha[this.selectedLanguage] !== ''
          : true) &&
        (this.filters.juma
          ? mosque.timings.juma[this.selectedLanguage] !== ''
          : true)
    );
  }

  editMosque(mosque: Mosque): void {
    if (this.authService.isAuthenticated()) {
      this.newMosque = { ...mosque };
      this.isEditing = true;
      this.isAddOrUpdateFormVisible = true;
    }
  }

  addOrUpdateMosque(): void {
    if (this.isEditing && this.newMosque._id) {
      this.mosqueService
        .updateMosque(this.newMosque._id, this.newMosque)
        .subscribe(() => {
          this.loadMosques();
          this.resetForm();
        });
    } else {
      this.mosqueService.addMosque(this.newMosque).subscribe(() => {
        this.loadMosques();
        this.resetForm();
      });
    }
    this.toggleAddOrUpdateMosqueForm();
  }

  toggleAddOrUpdateMosqueForm(): void {
    this.isAddOrUpdateFormVisible = !this.isAddOrUpdateFormVisible;
    if (!this.isAddOrUpdateFormVisible) {
      // Reset form when closing
      this.resetForm();
      this.isEditing = false;
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

  viewMosqueDetails(mosque: any): void {
    if (mosque && mosque._id) {
      this.router.navigate(['/mosque', mosque._id]); // Redirect to mosque details page with ID
    }
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

  // Function to calculate current and next prayer based on time ranges
  calculateCurrentAndNextPrayer(): void {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // Get the current day (0 = Sunday, 1 = Monday, ..., 5 = Friday)

    // Determine the current prayer
    const currentPrayerObj = this.prayerTimes.find(
      (prayer) => currentHour >= prayer.start && currentHour < prayer.end
    );
    this.selectedPrayer = currentPrayerObj
      ? (currentPrayerObj.name.toLowerCase() as PrayerType)
      : 'isha';

    // Replace Dhuhr with Juma on Friday
    if (currentDay === 5) {
      const dhuhrPrayer = this.prayerTimes.find(
        (prayer) => prayer.name === 'Dhuhr'
      );
      if (dhuhrPrayer) {
        dhuhrPrayer.name = 'Juma'; // Change Dhuhr to Juma
      }
    }

    // Determine the next prayer
    const nextPrayerObj = this.prayerTimes.find(
      (prayer) => currentHour < prayer.start
    );
    this.nextPrayer = nextPrayerObj ? nextPrayerObj.name : 'Fajr'; // Default to Fajr if no next prayer found
  }

  getPrayerName(key: string): string {
    return prayerMap[key][this.selectedLanguage] || prayerMap[key]['en'];
  }
}
